import { plafromDetector } from '../../helpers/platformDetector';

import { ISpciUsb, ISpciUsbDevice } from './interface';
import Macos from './macos';
import Windows from './windows';

/**
 * Class representing a USB device.
 */
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
     * Get information about USB devices.
     * This method returns an array of USB devices.
     * The fields in each USB device object depend on the underlying operating system.
     * @example
     * const usb = new Usb();
     * const devices = await usb.getDevices();
     * console.log(devices);
     * @returns {Promise<ISpciUsbDevice[]>} A promise that resolves to an array of USB devices.
     */
    public async getDevices(): Promise<ISpciUsbDevice[]> {
        if (this.PLATFORM === null) return [];

        const result = await this.PLATFORM.getInfo();
        return result;
    }
}

export default Usb;
