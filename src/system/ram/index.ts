import { plafromDetector } from '../../helpers/platformDetector';

import { ISpciRam, ISpciRamFields, ISpciRamLayoutFields } from './interfaces';
import Windows from './windows';

class Ram implements ISpciRam {
    private PLATFORM: ISpciRam | null = null;

    constructor() {
        this.PLATFORM = plafromDetector<ISpciRam | null>({
            linux: null,
            macos: null,
            windows: new Windows(),
        });
    }

    /**
     * Get base RAM information.
     * This method returns an object containing RAM fields or null if information is unavailable.
     * The fields in the RAM object depend on the underlying operating system.
     * @example
     * const ram = new Ram();
     * const info = await ram.getInfo();
     * console.log(info);
     * @returns {Promise<ISpciRamFields | null>} A promise that resolves to RAM information object or null.
     */
    public async getInfo(): Promise<ISpciRamFields | null> {
        if (this.PLATFORM === null) return null;

        const result = await this.PLATFORM.getInfo();
        return result;
    }

    /**
     * Get RAM layout information.
     * This method returns an array of RAM layout fields.
     * The fields in each RAM layout field object depend on the underlying operating system.
     * @example
     * const ram = new Ram();
     * const layout = await ram.getLayout();
     * console.log(layout);
     * @returns {Promise<ISpciRamLayoutFields[]>} A promise that resolves to an array of RAM layout fields.
     */
    public async getLayout(): Promise<ISpciRamLayoutFields[]> {
        if (this.PLATFORM === null) return [];

        const result = await this.PLATFORM.getLayout();
        return result;
    }
}

export default Ram;
