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

export interface ISpciUsb {
    getInfo: () => Promise<ISpciUsbDevice[]>;
}
