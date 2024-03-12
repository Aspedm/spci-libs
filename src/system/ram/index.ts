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
     * Get base ram information
     * @returns {Promise<ISpciRamFields | null>}
     */
    public async getInfo(): Promise<ISpciRamFields | null> {
        if (this.PLATFORM === null) return null;

        const result = await this.PLATFORM.getInfo();
        return result;
    }

    /**
     * Get ram layout info
     * @returns {Promise<ISpciRamLayoutFields[]>}
     */
    public async getLayout(): Promise<ISpciRamLayoutFields[]> {
        if (this.PLATFORM === null) return [];

        const result = await this.PLATFORM.getLayout();
        return result;
    }
}

export default Ram;
