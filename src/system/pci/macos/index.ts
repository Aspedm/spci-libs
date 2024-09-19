import { ISpciPCI, ISpciPciDevice } from '../interface';

class Macos implements ISpciPCI {
    /**
     * Get Mac OS pci devices
     * @returns {Promise<ISpciPciDevice>}
     */
    public async getInfo(): Promise<ISpciPciDevice[]> {
        return [];
    }
}

export default Macos;
