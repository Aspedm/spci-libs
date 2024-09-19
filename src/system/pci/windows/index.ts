import get from 'lodash/get';
import shelljs from 'shelljs';

import { DEFAULT_FIELDS_VALUES } from '../config';
import { ISpciPCI, ISpciPciDevice } from '../interface';

class Windows implements ISpciPCI {
    private PCI_FIELDS: ISpciPciDevice = { ...DEFAULT_FIELDS_VALUES };

    private CMD: string =
        "Get-PnpDevice -PresentOnly | Where-Object { $_.InstanceId -like '*PCI*' } | Select-Object Class, FriendlyName, InstanceId, DeviceID, Problem, ConfigManagerErrorCode, ProblemDescription, Name, Description, Status, Manufacturer, PNPClass, Present | ConvertTo-Json";

    private PCI_BLOCK_LIST: string[] = [];

    /**
     * @param {string} output
     * @returns {Record<string, string>[] | null}
     */
    private parseOutput(output: string): Record<string, string>[] | null {
        if (typeof output !== 'string' || output.length === 0) return null;

        try {
            const result: Record<string, string>[] = JSON.parse(output);
            return result;
        } catch (error) {
            console.error('Error while parse Windows pci output', error);
            return null;
        }
    }

    /**
     * @param {string | null} name
     * @returns {boolean}
     */
    private invalidDevice(name: string | null): boolean {
        if (typeof name !== 'string') return true;
        const value = name.toLowerCase();

        const result = this.PCI_BLOCK_LIST.some(item => item.includes(value));
        return result;
    }

    /**
     * @param { Record<string, string>} pciObj
     * @param {number} id - Fake id
     * @returns {ISpciPciDevice | null}
     */
    private fillPciFields(pciObj: Record<string, string>, id: number): ISpciPciDevice | null {
        try {
            const name = get(pciObj, 'FriendlyName', null);
            const invalidDevice = this.invalidDevice(name);
            if (invalidDevice) {
                return null;
            }

            const pciFields: ISpciPciDevice = {
                ...this.PCI_FIELDS,
                id: id.toString(),
                class: get(pciObj, 'Class', null),
                friendlyName: get(pciObj, 'FriendlyName', null),
                instanceId: get(pciObj, 'InstanceId', null),
                deviceID: get(pciObj, 'DeviceID', null),
                problem: get(pciObj, 'Problem', null),
                configManagerErrorCode: get(pciObj, 'ConfigManagerErrorCode', null),
                problemDescription: get(pciObj, 'ProblemDescription', null),
                name,
                description: get(pciObj, 'Description', null),
                status: get(pciObj, 'Status', null),
                manufacturer: get(pciObj, 'Manufacturer', null),
                pnpClass: get(pciObj, 'PNPClass', null),
                present: get(pciObj, 'Present', null),
            };

            return pciFields;
        } catch (error) {
            console.error('Error while fill pci fields', error);
            return null;
        }
    }

    /**
     * @returns {Promise<ISpciPciDevice[]>}
     */
    private async getDevicesFromTerminal(): Promise<ISpciPciDevice[]> {
        return new Promise((resolve, reject) => {
            const result: ISpciPciDevice[] = [];
            const responce = shelljs.exec(`powershell.exe -Command "${this.CMD}"`, {
                async: false,
                silent: true,
            });

            if (responce.code !== 0) {
                console.error('Error while get data from terminal. Code:', responce.code);
                reject(responce.stderr);
            }

            const devices = this.parseOutput(responce.stdout);
            if (devices === null) {
                reject(new Error('Error while parse windows output'));
            }

            devices.forEach((device, index) => {
                const pci = this.fillPciFields(device, index + 1);

                if (pci !== null) {
                    result.push(pci);
                }
            });

            resolve(result);
        });
    }

    /**
     * Get windows pci devices
     * @returns {Promise<ISpciPciDevice>}
     */
    public async getInfo(): Promise<ISpciPciDevice[]> {
        const result = await this.getDevicesFromTerminal();
        return result;
    }
}

export default Windows;
