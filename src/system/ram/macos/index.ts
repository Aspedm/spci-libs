import { execFile } from 'child_process';
import os from 'os';

import { DEFAULT_RAM_INFO_FIELDS, DEFAULT_RAM_LAYOUT_FIELDS } from '../config';
import { ISpciRam, ISpciRamFields, ISpciRamLayoutFields } from '../interfaces';

class Macos implements ISpciRam {
    private CMD_VM_STAT: [string, string[]] = ['vm_stat', []];

    private CMD_SWAP: [string, string[]] = ['sysctl', ['vm.swapusage']];

    private CMD_LAYOUT: [string, string[]] = ['system_profiler', ['SPMemoryDataType', '-json']];

    private MAX_BUFFER: number = 1024 * 1024;

    // Timeout for system_profiler which can be slow on some machines
    private LAYOUT_TIMEOUT: number = 5000;

    // Cache layout for 30s — physical RAM config never changes at runtime
    private LAYOUT_CACHE_TTL: number = 30000;

    private layoutCache: { data: ISpciRamLayoutFields[]; timestamp: number } | null = null;

    // Alias map for vm_stat page keys that may differ across macOS versions / locales.
    // Each entry lists known variants; first found in the output wins.
    private static readonly VM_STAT_ALIASES: Record<string, string[]> = {
        free: ['Pages free'],
        active: ['Pages active'],
        inactive: ['Pages inactive'],
        speculative: ['Pages speculative'],
        purgeable: ['Pages purgeable'],
        fileBacked: ['File-backed pages', 'File backed pages'],
        wired: ['Pages wired down', 'Pages wired'],
        compressor: ['Pages occupied by compressor', 'Pages compressor'],
    };

    /**
     * @param {string} cmd
     * @param {string[]} args
     * @param {number} timeout  0 means no timeout
     * @returns {Promise<string>}
     */
    private runCommand(cmd: string, args: string[], timeout = 0): Promise<string> {
        return new Promise((resolve, reject) => {
            const options = timeout > 0 ? { maxBuffer: this.MAX_BUFFER, timeout } : { maxBuffer: this.MAX_BUFFER };

            const child = execFile(cmd, args, options, (error, stdout) => {
                if (error) return reject(error);
                return resolve(stdout);
            });

            child.on('error', reject);
        });
    }

    /**
     * Resolve a vm_stat page count by trying alias variants for a field.
     * Returns 0 if no alias is found in the parsed pages map.
     * @param {Record<string, number>} pages
     * @param {string} field  key from VM_STAT_ALIASES
     * @returns {number}
     */
    private getPages(pages: Record<string, number>, field: string): number {
        const aliases = Macos.VM_STAT_ALIASES[field] ?? [field];
        const found = aliases.find(key => key in pages);
        return found !== undefined ? pages[found] ?? 0 : 0;
    }

    /**
     * Parse vm_stat output into page size and named page counts.
     * Example first line: "Mach Virtual Memory Statistics: (page size of 16384 bytes)"
     * Example data line:  "Pages free:                               13979."
     * @param {string} output
     * @returns {{ pageSize: number; pages: Record<string, number> } | null}
     */
    private parseVmStat(output: string): { pageSize: number; pages: Record<string, number> } | null {
        if (!output) return null;

        try {
            const pageSizeMatch = output.match(/page size of (\d+) bytes/);
            const pageSize = pageSizeMatch ? parseInt(pageSizeMatch[1], 10) : 4096;

            const pages: Record<string, number> = Object.fromEntries(
                output.split('\n').flatMap(line => {
                    const match = line.match(/^(.+?):\s+(\d+)\./);
                    return match ? [[match[1].trim(), parseInt(match[2], 10)]] : [];
                }),
            );

            return { pageSize, pages };
        } catch {
            return null;
        }
    }

    /**
     * Parse "sysctl vm.swapusage" output into bytes.
     * Example: "vm.swapusage: total = 2.00G  used = 512.00M  free = 1.50G  (encrypted)"
     * Handles suffixes: K, M, G, T (and optional trailing B), or no suffix (raw bytes).
     * @param {string} output
     * @returns {{ total: number; used: number; free: number } | null}
     */
    private parseSwapUsage(output: string): { total: number; used: number; free: number } | null {
        if (!output) return null;

        try {
            const toBytes = (num: number, unit: string): number => {
                const u = unit.replace(/b$/i, '').toUpperCase();
                if (u === 'K') return Math.round(num * 1024);
                if (u === 'M') return Math.round(num * 1024 ** 2);
                if (u === 'G') return Math.round(num * 1024 ** 3);
                if (u === 'T') return Math.round(num * 1024 ** 4);
                return Math.round(num); // no suffix → raw bytes
            };

            const totalMatch = output.match(/total\s*=\s*([\d.]+)\s*([KMGT]?B?)/i);
            const usedMatch = output.match(/used\s*=\s*([\d.]+)\s*([KMGT]?B?)/i);
            const freeMatch = output.match(/free\s*=\s*([\d.]+)\s*([KMGT]?B?)/i);

            return {
                total: totalMatch ? toBytes(parseFloat(totalMatch[1]), totalMatch[2]) : 0,
                used: usedMatch ? toBytes(parseFloat(usedMatch[1]), usedMatch[2]) : 0,
                free: freeMatch ? toBytes(parseFloat(freeMatch[1]), freeMatch[2]) : 0,
            };
        } catch {
            return null;
        }
    }

    /**
     * Convert size string like "16 GB" or "512 MB" to bytes.
     * @param {string} sizeStr
     * @returns {number | null}
     */
    private parseSizeToBytes(sizeStr: string): number | null {
        const match = sizeStr.match(/([\d.]+)\s*(KB|MB|GB|TB)/i);
        if (!match) return null;

        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        if (unit === 'KB') return Math.round(value * 1024);
        if (unit === 'MB') return Math.round(value * 1024 ** 2);
        if (unit === 'GB') return Math.round(value * 1024 ** 3);
        if (unit === 'TB') return Math.round(value * 1024 ** 4);

        return null;
    }

    /**
     * Convert speed string like "2667 MHz" to MHz number.
     * @param {string} speedStr
     * @returns {number | null}
     */
    private parseSpeedToMhz(speedStr: string): number | null {
        const match = speedStr.match(/(\d+)\s*MHz/i);
        return match ? parseInt(match[1], 10) : null;
    }

    /**
     * Extract DIMM slot number from bank name like "BANK 0/DIMM0".
     * @param {string} name
     * @returns {number | null}
     */
    private parseSlotFromName(name: string): number | null {
        const match = name.match(/DIMM(\d+)/i);
        return match ? parseInt(match[1], 10) : null;
    }

    /**
     * Parse system_profiler SPMemoryDataType JSON output.
     * On Apple Silicon (arm64): single entry with unified memory info.
     * On Intel: one entry per physical DIMM slot.
     * @param {string} output
     * @returns {ISpciRamLayoutFields[]}
     */
    private parseLayoutOutput(output: string): ISpciRamLayoutFields[] {
        if (!output) return [];

        try {
            const json = JSON.parse(output);
            const items: Record<string, unknown>[] = json?.SPMemoryDataType ?? [];

            if (!Array.isArray(items) || items.length === 0) return [];

            // Apple Silicon: unified memory — single entry, size stored in `SPMemoryDataType` field
            if (process.arch === 'arm64') {
                const entry = items[0];
                const sizeStr = (entry.SPMemoryDataType as string) ?? null;

                return [
                    {
                        ...DEFAULT_RAM_LAYOUT_FIELDS,
                        size: sizeStr ? this.parseSizeToBytes(sizeStr) : null,
                        type: (entry.dimm_type as string) ?? null,
                        manufacturer: (entry.dimm_manufacturer as string) ?? null,
                    },
                ];
            }

            // Intel: per-DIMM entries
            const result: ISpciRamLayoutFields[] = [];

            items
                .filter(item => (item.dimm_status as string) !== 'empty')
                .forEach(item => {
                    const name = (item._name as string) ?? '';
                    const sizeStr = (item.dimm_size as string) ?? null;
                    const speedStr = (item.dimm_speed as string) ?? null;

                    result.push({
                        ...DEFAULT_RAM_LAYOUT_FIELDS,
                        size: sizeStr ? this.parseSizeToBytes(sizeStr) : null,
                        bank: name || null,
                        slot: this.parseSlotFromName(name),
                        type: (item.dimm_type as string) ?? null,
                        clockSpeed: speedStr ? this.parseSpeedToMhz(speedStr) : null,
                        formFactor: (item.dimm_form_factor as string) ?? null,
                        manufacturer: (item.dimm_manufacturer as string) ?? null,
                        partNum: (item.dimm_part_number as string) ?? null,
                        serialNum: (item.dimm_serial_number as string) ?? null,
                    });
                });

            return result;
        } catch (error) {
            console.error('Error while parsing macOS RAM layout:', error);
            return [];
        }
    }

    /**
     * Get mac os ram base information
     * @returns {Promise<ISpciRamFields | null>}
     */
    public async getInfo(): Promise<ISpciRamFields | null> {
        try {
            const [vmStatOut, swapOut] = await Promise.all([
                this.runCommand(...this.CMD_VM_STAT),
                this.runCommand(...this.CMD_SWAP),
            ]);

            const vmStat = this.parseVmStat(vmStatOut);
            if (!vmStat) return null;

            const swap = this.parseSwapUsage(swapOut);
            const { pageSize, pages } = vmStat;

            const free = this.getPages(pages, 'free') * pageSize;
            const active = this.getPages(pages, 'active') * pageSize;
            const inactive = this.getPages(pages, 'inactive') * pageSize;
            const speculative = this.getPages(pages, 'speculative') * pageSize;
            const purgeable = this.getPages(pages, 'purgeable') * pageSize;
            const fileBacked = this.getPages(pages, 'fileBacked') * pageSize;
            const wired = this.getPages(pages, 'wired') * pageSize;
            const compressed = this.getPages(pages, 'compressor') * pageSize;
            const total = os.totalmem();

            return {
                ...DEFAULT_RAM_INFO_FIELDS,
                total,
                free,
                // active + wired + compressed — matches Activity Monitor "Used" breakdown
                used: active + wired + compressed,
                active,
                // inactive pages are immediately reclaimable — include in available
                available: free + speculative + purgeable + inactive,
                cached: fileBacked,
                swaptotal: swap?.total ?? null,
                swapused: swap?.used ?? null,
                swapfree: swap?.free ?? null,
                wired,
                compressed,
            };
        } catch (error) {
            console.error('Error while getting macOS RAM info:', error);
            return null;
        }
    }

    /**
     * Get mac os ram layouts.
     * Result is cached for LAYOUT_CACHE_TTL ms since physical RAM config never changes at runtime.
     * @returns {Promise<ISpciRamLayoutFields[]>}
     */
    public async getLayout(): Promise<ISpciRamLayoutFields[]> {
        const now = Date.now();

        if (this.layoutCache !== null && now - this.layoutCache.timestamp < this.LAYOUT_CACHE_TTL) {
            return this.layoutCache.data;
        }

        try {
            const output = await this.runCommand(...this.CMD_LAYOUT, this.LAYOUT_TIMEOUT);
            const data = this.parseLayoutOutput(output);
            this.layoutCache = { data, timestamp: now };
            return data;
        } catch (error) {
            console.error('Error while getting macOS RAM layout:', error);
            return [];
        }
    }
}

export default Macos;
