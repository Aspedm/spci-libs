import { ISpciUsb, ISpciUsbDevice } from '../interface';

class Linux implements ISpciUsb {
    /**
     * Get linux usb devices
     * @returns {Promise<ISpciUsbDevice>}
     */
    public async getInfo(): Promise<ISpciUsbDevice[]> {
        return [];
    }
}

export default Linux;
