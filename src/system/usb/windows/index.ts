import { ISpciUsb, ISpciUsbDevice } from '../interface';

class Windows implements ISpciUsb {
    /**
     * Get windows usb devices
     * @returns {Promise<ISpciUsbDevice>}
     */
    public async getInfo(): Promise<ISpciUsbDevice[]> {
        return [];
    }
}

export default Windows;
