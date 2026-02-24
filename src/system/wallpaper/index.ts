import { plafromDetector } from '../../helpers/platformDetector';

import { ISpciWallpaper } from './interface';
import Macos from './macos';
import Windows from './windows';

/**
 * Class representing current wallpaper.
 */
class Wallpaper {
    private PLATFORM: ISpciWallpaper | null = null;

    constructor() {
        this.PLATFORM = plafromDetector<ISpciWallpaper | null>({
            linux: null,
            macos: new Macos(),
            windows: new Windows(),
        });
    }

    /**
     * Get current wallpaper.
     * @example
     * const wallpaper = new Wallpaper();
     * const img = await wallpaper.getImage();
     * console.log(img);
     * @returns {Promise<string | null>}
     */
    public async getImage(): Promise<string | null> {
        if (this.PLATFORM === null) return null;

        const result = await this.PLATFORM.getImage();
        return result;
    }
}

export default Wallpaper;
