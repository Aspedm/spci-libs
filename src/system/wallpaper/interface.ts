export interface ISpciWallpaper {
    /**
     * Get current wallpaper.
     * @returns {Promise<string | null>}
     */
    getImage: () => Promise<string | null>;
}
