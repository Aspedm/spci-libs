import { ISpciRam, ISpciRamFields, ISpciRamLayoutFields } from '../interfaces';

class Macos implements ISpciRam {
    /**
     * Get windows ram base information
     * @returns {Promise<ISpciRamFields | null>}
     */
    public async getInfo(): Promise<ISpciRamFields | null> {
        return null;
    }

    /**
     * Get mac os ram layouts
     * @returns {Promise<ISpciUsbDevice>}
     */
    public async getLayout(): Promise<ISpciRamLayoutFields[]> {
        return [];
    }
}

export default Macos;
