import { ISpciPCI, ISpciPciDevice } from '../interface';

class Linux implements ISpciPCI {
    /**
     * Get linux pci devices
     * @returns {Promise<ISpciPciDevice>}
     */
    public async getInfo(): Promise<ISpciPciDevice[]> {
        return [];
    }
}

export default Linux;
