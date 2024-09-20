import { exec } from 'child_process';

import get from 'lodash/get';

import { POWERSHELL_ARGS_EXEC } from '@src/helpers/terminalParams/windows';

import { DEFAULT_FIELDS_VALUES } from '../config';
import { ISpciUsb, ISpciUsbDevice } from '../interface';

import DeviceType from './DeviceType';

class Windows implements ISpciUsb {
    private USB_FIELDS: ISpciUsbDevice = { ...DEFAULT_FIELDS_VALUES };

    private USB_BLOCK_LIST: string[] = [];

    private CMD: string =
        "Get-PnpDevice -PresentOnly | Where-Object { $_.InstanceId -match '^USB' } | Select-Object InstanceId, Status, ClassGuid, Manufacturer, DeviceId, FriendlyName, HardwareId, Service, Description | ConvertTo-JSON";

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
            console.error('Error while parse Windows usb output', error);
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

        const result = this.USB_BLOCK_LIST.some(item => item.includes(value));
        return result;
    }

    /**
     * @param { Record<string, string>} usbObj
     * @param {number} id - Fake id
     * @returns {ISpciUsbDevice | null}
     */
    private fillUsbFields(usbObj: Record<string, string>, id: number): ISpciUsbDevice | null {
        try {
            const name = get(usbObj, 'FriendlyName', null);
            const invalidDevice = this.invalidDevice(name);
            if (invalidDevice) {
                return null;
            }

            const deviceId = get(usbObj, 'InstanceId', null);
            const type = `${get(usbObj, 'Service', '').toLowerCase()} ${get(usbObj, 'FriendlyName', '').toLowerCase()}`;
            const manufacturer = get(usbObj, 'Manufacturer', null);

            const usbFields: ISpciUsbDevice = {
                ...this.USB_FIELDS,
                id: id.toString(),
                name,
                deviceId,
                type: DeviceType.determinateType(type, get(usbObj, 'Service', '')),
                manufacturer,
            };

            return usbFields;
        } catch (error) {
            console.error('Error while fill usb fields', error);
            return null;
        }
    }

    /**
     * @returns {Promise<ISpciUsbDevice[]>}
     */
    private async getDevicesFromTerminal(): Promise<ISpciUsbDevice[]> {
        return new Promise((resolve, reject) => {
            const result: ISpciUsbDevice[] = [];

            try {
                const responce = exec(
                    `powershell.exe -Command "${this.CMD}"`,
                    { ...POWERSHELL_ARGS_EXEC },
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error('Error while getting data from terminal:', error.message);
                            return reject(error);
                        }

                        if (stderr) {
                            console.error('PowerShell error output:', stderr);
                            return reject(new Error(stderr));
                        }

                        // Парсим результат вывода
                        const devices = this.parseOutput(stdout);
                        if (devices === null) {
                            return reject(new Error('Error while parsing Windows output'));
                        }

                        // Обрабатываем каждое устройство
                        devices.forEach((device, index) => {
                            const usb = this.fillUsbFields(device, index + 1);

                            if (usb !== null) {
                                result.push(usb);
                            }
                        });

                        return resolve(result);
                    },
                );

                responce.on('error', err => {
                    reject(err);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get windows usb devices
     * @returns {Promise<ISpciUsbDevice>}
     */
    public async getInfo(): Promise<ISpciUsbDevice[]> {
        const result = await this.getDevicesFromTerminal();
        return result;
    }
}

export default Windows;
