import { plafromDetector } from '../../helpers/platformDetector';

import { ISpciPCI, ISpciPciDevice } from './interface';
import Windows from './windows';

/**
 * Class representing a PCI device.
 */
class Pci {
    private PLATFORM: ISpciPCI | null = null;

    constructor() {
        this.PLATFORM = plafromDetector<ISpciPCI | null>({
            linux: null,
            macos: null,
            windows: new Windows(),
        });
    }

    /**
     * Get information about PCI devices.
     * This method returns an array of PCI devices.
     * The fields in each PCI device object depend on the underlying operating system.
     * @example
     * const pci = new Pci();
     * const devices = await pci.getDevices();
     * console.log(devices);
     * @returns {Promise<ISpciPciDevice[]>} A promise that resolves to an array of PCI devices.
     */
    public async getDevices(): Promise<ISpciPciDevice[]> {
        if (this.PLATFORM === null) return [];

        const result = await this.PLATFORM.getInfo();
        return result;
    }
}

export default Pci;
