export interface ISpciPciDevice {
    id: string | null;
    class: string | null;
    friendlyName: string | null;
    instanceId: string | null;
    deviceID: string | null;
    problem: number | null;
    configManagerErrorCode: number | null;
    problemDescription: string | null;
    name: string | null;
    description: string | null;
    status: string | null;
    manufacturer: string | null;
    pnpClass: string | null;
    present: boolean | null;
}

/**
 * Interface representing a PCI devices.
 */
export interface ISpciPCI {
    /**
     * Get information about PCI devices.
     * @returns {Promise<ISpciPciDevice[]>} A promise that resolves to an array of PCI devices.
     */
    getInfo: () => Promise<ISpciPciDevice[]>;
}
