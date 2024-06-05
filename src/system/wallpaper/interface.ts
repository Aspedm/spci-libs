export interface ISpciWallpaper {
    /**
     * Get current wallaper.
     * @returns {Promise<string>}
     */
    getImage: () => Promise<string>;
}
