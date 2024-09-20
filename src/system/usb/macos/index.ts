import { exec } from 'child_process';

import get from 'lodash/get';

import { DEFAULT_FIELDS_VALUES, MAX_BUFFER } from '../config';
import { ISpciUsb, ISpciUsbDevice } from '../interface';

import DeviceBus from './DeviceBus';
import DeviceType from './DeviceType';
import DeviceVendor from './DeviceVendor';

class Macos implements ISpciUsb {
    private USB_FIELDS: ISpciUsbDevice = { ...DEFAULT_FIELDS_VALUES };

    private CMD: string = 'system_profiler SPUSBDataType -json';

    /**
     * @returns {string}
     */
    private getUnicID(): string {
        return Math.random().toString(36).substr(2, 10);
    }

    /**
     * @param {string} output
     * @returns {Record<string, unknown> | null}
     */
    private parseOutput(output: string): Record<string, unknown> | null {
        if (typeof output !== 'string' || output.length === 0) return null;

        try {
            const result: Record<string, unknown> = JSON.parse(output);
            return result;
        } catch (error) {
            console.error('Error while parse Mac OS output:', error);
            return null;
        }
    }

    /**
     * @param { Record<string, unknown>} usbArray
     * @returns {ISpciUsbDevice[] | null}
     */
    private fillUsbFields(usbArray: Record<string, unknown>[]): ISpciUsbDevice[] | null {
        try {
            if (!Array.isArray(usbArray) || usbArray.length === 0) return null;
            const result: ISpciUsbDevice[] = [];

            usbArray.forEach(usbObj => {
                const hasMedia = get(usbObj, 'Media', null);
                const removable = hasMedia ? get(usbObj, 'Media[0].removable_media', null) === 'yes' : null;

                const usbFields: ISpciUsbDevice = {
                    ...this.USB_FIELDS,
                    id: this.getUnicID(),
                    bus: DeviceBus.determinateBus(get(usbObj, 'location_id', null)),
                    name: get(usbObj, '_name', null),
                    deviceId: get(usbObj, 'product_id', null),
                    removable,
                    type: DeviceType.determinateType(get(usbObj, '_name', null), get(usbObj, 'Media', null)),
                    vendor: DeviceVendor.determinateVendor(get(usbObj, 'vendor_id', null)),
                    manufacturer: get(usbObj, 'manufacturer', null),
                    maxPower: get(usbObj, 'bus_power', null),
                    serialNumber: get(usbObj, 'serial_num', null),
                };

                result.push(usbFields);
            });

            return result;
        } catch (error) {
            console.error('Error while fill usb fields');
            return null;
        }
    }

    /**
     * @returns {Promise<ISpciUsbDevice[]>}
     */
    private async getDevicesFromTerminal(): Promise<ISpciUsbDevice[]> {
        return new Promise((resolve, reject) => {
            try {
                const result: ISpciUsbDevice[][] = [];

                const responce = exec(this.CMD, { maxBuffer: MAX_BUFFER }, (error, stdout, stderr) => {
                    if (error) {
                        return reject(error);
                    }

                    if (stderr) {
                        console.error(stderr);
                        return reject(new Error(stderr));
                    }

                    try {
                        const rawUsbObj = this.parseOutput(stdout);
                        const SPUSB: Record<string, unknown>[] | undefined = rawUsbObj?.SPUSBDataType as Record<
                            string,
                            unknown
                        >[];

                        if (!Array.isArray(SPUSB)) {
                            return reject(new Error('Can`t find SPUSBDataType class'));
                        }

                        SPUSB.forEach(item => {
                            if (typeof item?._items !== 'undefined') {
                                const usb = this.fillUsbFields(item._items as Record<string, unknown>[]);

                                if (usb !== null) {
                                    result.push(usb);
                                }
                            }
                        });

                        return resolve(result.flat());
                    } catch (parseError) {
                        reject(new Error(`Error while parse Mac OS output: ${parseError.message}`));
                        return [];
                    }
                });

                responce.on('error', err => {
                    reject(err);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get mac os usb devices
     * @returns {Promise<ISpciUsbDevice>}
     */
    public async getInfo(): Promise<ISpciUsbDevice[]> {
        const result = await this.getDevicesFromTerminal();
        return result;
    }
}

export default Macos;
