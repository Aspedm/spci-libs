import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

import { ISpciWallpaper } from '../interface';

class Macos implements ISpciWallpaper {
    /**
     * Present on macOS 13+ when the wallpaper system was rewritten.
     * Checked with fs.access before calling plutil to avoid the 5 s timeout on older systems.
     */
    private readonly WALLPAPER_STORE_PLIST: string = path.join(
        os.homedir(),
        'Library/Application Support/com.apple.wallpaper/Store/Index.plist',
    );

    private readonly AERIALS_THUMBNAILS_DIR: string = path.join(
        os.homedir(),
        'Library/Application Support/com.apple.wallpaper/aerials/thumbnails',
    );

    private readonly AERIALS_VIDEOS_DIR: string = path.join(
        os.homedir(),
        'Library/Application Support/com.apple.wallpaper/aerials/videos',
    );

    private static readonly MAX_BUFFER: number = 1024 * 1024;

    private static readonly TIMEOUT: number = 5000;

    /** Max bytes to scan after the 'assetID' marker when looking for a UUID in the binary plist. */
    private static readonly ASSET_ID_SCAN_WINDOW: number = 512;

    /** Max wallpaper file size to read into memory (50 MB). */
    private static readonly MAX_FILE_SIZE: number = 50 * 1024 * 1024;

    private static readonly UUID_RE = /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/;

    private static readonly IMAGE_EXTS_RE = /\.(png|jpe?g|heic|tiff?|webp)$/i;

    /**
     * @param {string} cmd
     * @param {string[]} args
     * @returns {Promise<string>}
     */
    private runCommand(cmd: string, args: string[]): Promise<string> {
        return new Promise((resolve, reject) => {
            execFile(cmd, args, { maxBuffer: Macos.MAX_BUFFER, timeout: Macos.TIMEOUT }, (error, stdout) => {
                if (error) return reject(error);
                return resolve(stdout.trim());
            });
        });
    }

    /**
     * Safely decode a file:// URL path component.
     * First decodes XML entities (&amp; → &), then decodes URI percent-encoding.
     * Falls back to the XML-decoded string if decodeURIComponent throws.
     * @param {string} encoded
     * @returns {string}
     */
    private decodeFilePath(encoded: string): string {
        const xmlDecoded = encoded
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"');
        try {
            return decodeURIComponent(xmlDecoded);
        } catch {
            return xmlDecoded;
        }
    }

    /**
     * For Aerials/dynamic wallpapers: extract assetID UUID from the Configuration
     * binary plist (stored as base64 in the XML plist), then return the cached thumbnail.
     * UUID search is anchored to the 'assetID' ASCII marker inside the binary plist bytes
     * to avoid false positives on unrelated binary sequences.
     * Verifies thumbnail existence with fs.access before returning the path.
     * @param {string} xml
     * @returns {Promise<string | null>}
     */
    private async getAerialThumbnailPath(xml: string): Promise<string | null> {
        const configDataMatch = xml.match(/<key>Configuration<\/key>\s*<data>\s*([\s\S]*?)\s*<\/data>/);
        if (!configDataMatch) return null;

        const bytes = Buffer.from(configDataMatch[1].replace(/\s/g, ''), 'base64');
        const text = bytes.toString('latin1');

        const markerIdx = text.indexOf('assetID');
        if (markerIdx === -1) return null;

        const uuidMatch = text.slice(markerIdx, markerIdx + Macos.ASSET_ID_SCAN_WINDOW).match(Macos.UUID_RE);
        if (!uuidMatch) return null;

        const thumbnailPath = path.join(this.AERIALS_THUMBNAILS_DIR, `${uuidMatch[0]}.png`);

        try {
            await fs.access(thumbnailPath);
            return thumbnailPath;
        } catch {
            return null;
        }
    }

    /**
     * Fallback for Aerial shuffle mode (Provider = "default"): Configuration is empty,
     * so there is no assetID. Pick the most recently modified video from the cached
     * aerials/videos/ directory and return its thumbnail.
     * @returns {Promise<string | null>}
     */
    private async getAerialThumbnailFromVideos(): Promise<string | null> {
        try {
            const entries = await fs.readdir(this.AERIALS_VIDEOS_DIR, { withFileTypes: true });
            const movFiles = entries.filter(e => e.isFile() && e.name.endsWith('.mov'));

            if (movFiles.length === 0) return null;

            // Find the most recently modified video (likely the one currently playing)
            const stats = await Promise.all(
                movFiles.map(async f => {
                    const stat = await fs.stat(path.join(this.AERIALS_VIDEOS_DIR, f.name));
                    return { name: f.name, mtimeMs: stat.mtimeMs };
                }),
            );

            const newest = stats.reduce((a, b) => (b.mtimeMs > a.mtimeMs ? b : a));
            if (!newest) return null;

            const uuid = newest.name.replace(/\.mov$/i, '');
            const thumbnailPath = path.join(this.AERIALS_THUMBNAILS_DIR, `${uuid}.png`);

            try {
                await fs.access(thumbnailPath);
                return thumbnailPath;
            } catch {
                return null;
            }
        } catch {
            return null;
        }
    }

    /**
     * macOS 13+ (Darwin 22+): parse wallpaper path from com.apple.wallpaper Store plist.
     * Uses xml1 format — JSON conversion fails on <date> objects present in this plist.
     * Handles regular image wallpapers (file:// URL in Files array) and
     * Aerials / dynamic wallpapers (assetID → cached thumbnail PNG).
     * Skips plutil entirely if the plist file is absent (saves timeout on older systems).
     * @returns {Promise<string | null>}
     */
    private async getPathViaWallpaperStore(): Promise<string | null> {
        try {
            await fs.access(this.WALLPAPER_STORE_PLIST);
        } catch {
            return null;
        }

        try {
            const xml = await this.runCommand('plutil', ['-convert', 'xml1', '-o', '-', this.WALLPAPER_STORE_PLIST]);

            // Regular image wallpaper: find all file:// paths, prefer known image extensions
            const matches = Array.from(xml.matchAll(/file:\/\/\/([^<"]+)/g));

            if (matches.length > 0) {
                const decoded = matches.map(m => this.decodeFilePath(m[1])).filter(p => p.startsWith('/'));

                return decoded.find(p => Macos.IMAGE_EXTS_RE.test(p)) ?? decoded[0] ?? null;
            }

            // Aerial / dynamic wallpaper: find thumbnail by assetID
            const aerialPath = await this.getAerialThumbnailPath(xml);
            if (aerialPath) return aerialPath;

            // Aerial shuffle (Provider = "default"): Configuration is empty, fall back to cached videos
            return this.getAerialThumbnailFromVideos();
        } catch {
            return null;
        }
    }

    /**
     * macOS < 13: read wallpaper path from com.apple.desktop Background preference.
     * Handles both quoted (ImageFilePath = "/path/to/file";)
     * and unquoted (ImageFilePath = /path/to/file;) plist text output.
     * @returns {Promise<string | null>}
     */
    private async getPathViaDefaults(): Promise<string | null> {
        try {
            const output = await this.runCommand('defaults', ['read', 'com.apple.desktop', 'Background']);
            const match = output.match(/ImageFilePath\s*=\s*(?:"([^"]+)"|([^;\s]+))/);
            return match?.[1] ?? match?.[2] ?? null;
        } catch {
            return null;
        }
    }

    /**
     * Get current wallpaper as base64 image.
     * Tries the modern plist approach first (macOS 13+), falls back to defaults (macOS < 13).
     * Works on Intel and Apple Silicon. No admin rights or Automation permissions required.
     * @returns {Promise<string | null>}
     */
    public async getImage(): Promise<string | null> {
        try {
            // Darwin 22+ = macOS 13 and later
            const darwinMajor = parseInt(os.release().split('.')[0], 10);

            let imagePath: string | null;

            if (darwinMajor >= 22) {
                imagePath = (await this.getPathViaWallpaperStore()) ?? (await this.getPathViaDefaults());
            } else {
                imagePath = (await this.getPathViaDefaults()) ?? (await this.getPathViaWallpaperStore());
            }

            if (!imagePath) return null;

            const stat = await fs.stat(imagePath);
            if (stat.size > Macos.MAX_FILE_SIZE) return null;

            const data = await fs.readFile(imagePath);
            return data.toString('base64');
        } catch (error) {
            console.error('Error while getting macOS wallpaper:', error);
            return null;
        }
    }
}

export default Macos;
