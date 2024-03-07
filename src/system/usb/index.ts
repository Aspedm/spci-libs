import { plafromDetector } from '../../helpers/platformDetector';

import { ISpciUsb, ISpciUsbDevice } from './interface';
import Macos from './macos';
import Windows from './windows';

class Usb {
    private PLATFORM: ISpciUsb | null = null;

    constructor() {
        this.PLATFORM = plafromDetector<ISpciUsb | null>({
            linux: null,
            macos: new Macos(),
            windows: new Windows(),
        });
    }

    /**
     * Get USB devices
     * @returns {Promise<ISpciUsbDevice[]>}
     */
    public async getDevices(): Promise<ISpciUsbDevice[]> {
        if (this.PLATFORM === null) return [];

        const result = await this.PLATFORM.getInfo();
        return result;
    }
}

export default Usb;
