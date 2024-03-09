export interface ISpciUsbDevice {
    bus: string | null;
    deviceId: string | null;
    id: string | null;
    name: string | null;
    type: string | null;
    removable: boolean | null;
    vendor: string | null;
    manufacturer: string | null;
    maxPower: string | null;
    serialNumber: string | null;
}

/**
 * Interface representing a USB device.
 */
export interface ISpciUsb {
    /**
     * Get information about USB devices.
     * @returns {Promise<ISpciUsbDevice[]>} A promise that resolves to an array of USB devices.
     */
    getInfo: () => Promise<ISpciUsbDevice[]>;
}
