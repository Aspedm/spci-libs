/* eslint-disable @typescript-eslint/no-explicit-any */
import get from 'lodash/get';
import trim from 'lodash/trim';
import shelljs from 'shelljs';

import { DEFAULT_FIELDS_VALUES, MAX_BUFFER } from '../config';
import { ISpciUsb, ISpciUsbDevice } from '../interface';

import DeviceTypeMapper from './deviceTypeMapper';

class Macos implements ISpciUsb {
    private USB_FIELDS: ISpciUsbDevice = { ...DEFAULT_FIELDS_VALUES };

    private USB_BLOCK_LIST: string[] = [
        'apple t2 controller',
        'root hub simulation',
        'usb host controller',
        'facetime',
    ];

    private CMD: string = 'ioreg -p IOUSB -c AppleUSBRootHubDevice -w0 -l';

    /**
     * @param {string} output
     * @returns {Record<string, any> | null}
     */
    private parseOutput(output: string): Record<string, any> | null {
        if (typeof output !== 'string' || output.length === 0) return null;

        try {
            let device = output.replace(/ \|/g, '');
            device = device.trim();

            let lines = device.split('\n');
            lines.shift();

            lines = lines.map(originalLine => {
                let line = originalLine.trim().replace(/=/g, ':');

                if (line !== '{' && line !== '}' && lines[lines.indexOf(originalLine) + 1]?.trim() !== '}') {
                    line += ',';
                }

                line = line.replace(':Yes,', ':"Yes",');
                line = line.replace(': Yes,', ': "Yes",');
                line = line.replace(': Yes', ': "Yes"');
                line = line.replace(':No,', ':"No",');
                line = line.replace(': No,', ': "No",');
                line = line.replace(': No', ': "No"');

                // In this case (("com.apple.developer.driverkit.transport.usb"))
                line = line.replace('((', '').replace('))', '');

                // In case we have <923c11> we need make it "<923c11>" for correct JSON parse
                const match = /<(\w+)>/.exec(line);
                if (match) {
                    const number = match[0];
                    line = line.replace(number, `"${number}"`);
                }

                return line;
            });

            const usbObj = JSON.parse(lines.join('\n'));
            return usbObj;
        } catch (error) {
            console.error('Error while parse Mac OS output', error);
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
     * @param { Record<string, any>} usbObj
     * @returns {ISpciUsbDevice | null}
     */
    private fillUsbFields(usbObj: Record<string, any>): ISpciUsbDevice {
        try {
            const name = get(usbObj, 'kUSBProductString', null) || get(usbObj, 'USB Product Name', null);
            const invalidDevice = this.invalidDevice(name);
            if (invalidDevice) {
                return null;
            }

            const isRemovable =
                (usbObj['Built-In'] ? usbObj['Built-In'].toLowerCase() !== 'yes' : true) &&
                (usbObj['non-removable'] ? usbObj['non-removable'].toLowerCase() === 'no' : true);

            const type =
                (usbObj.kUSBProductString || usbObj['USB Product Name'] || '').toLowerCase() +
                (isRemovable ? ' removable' : '');
            const humanFriendlyType = DeviceTypeMapper.getFriendlyNameType(type);

            const usbFields: ISpciUsbDevice = {
                ...this.USB_FIELDS,
                id: get(usbObj, 'USB Address', null),
                name: trim(name),
                type: humanFriendlyType,
                removable: isRemovable,
                vendor: trim(get(usbObj, 'kUSBVendorString', null) || get(usbObj, 'USB Vendor Name', null)),
                manufacturer: trim(get(usbObj, 'kUSBVendorString', null) || get(usbObj, 'USB Vendor Name')),
                serialNumber: trim(get(usbObj, 'kUSBSerialNumberString', null)),
            };

            return usbFields;
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
            const result: ISpciUsbDevice[] = [];
            const responce = shelljs.exec(this.CMD, {
                async: true,
                silent: true,
                maxBuffer: MAX_BUFFER,
            });

            responce.stdout.on('data', data => {
                const parts: string[] = data.toString().split(' +-o ');

                for (let i = 1; i < parts.length; i++) {
                    const rawUsbObj = this.parseOutput(parts[i]);
                    const usb = this.fillUsbFields(rawUsbObj);

                    if (usb !== null) {
                        result.push(usb);
                    }
                }
            });

            responce.on('exit', () => {
                resolve(result);
            });

            responce.on('error', err => {
                reject(err);
            });
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
