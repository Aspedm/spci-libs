import os from 'os';

import get from 'lodash/get';
import shelljs from 'shelljs';

import { DEFAULT_RAM_LAYOUT_FIELDS, DEFAULT_RAM_INFO_FIELDS } from '../config';
import { ISpciRam, ISpciRamFields, ISpciRamLayoutFields } from '../interfaces';

import FormFactor from './FormFactor';
import MemotyType from './MemoryType';
import RamSlot from './RamSlot';

class Windows implements ISpciRam {
    private RAM_LAYOUT_FIELDS: ISpciRamLayoutFields = { ...DEFAULT_RAM_LAYOUT_FIELDS };

    private CMD_RAM_LAYOUT: string =
        'Get-CimInstance Win32_PhysicalMemory | select DataWidth,TotalWidth,Capacity,BankLabel,MemoryType,SMBIOSMemoryType,ConfiguredClockSpeed,FormFactor,Manufacturer,PartNumber,SerialNumber,ConfiguredVoltage,MinVoltage,MaxVoltage,Tag | ConvertTo-Json';

    private RAM_INFO_FIELDS: ISpciRamFields = { ...DEFAULT_RAM_INFO_FIELDS };

    private CMD_RAM_INFO: string =
        'Get-CimInstance Win32_PageFileUsage | Select AllocatedBaseSize, CurrentUsage | ConvertTo-Json';

    /**
     * @param {string} output
     * @returns {T | null}
     */
    private parseOutput<T>(output: string): T | null {
        if (typeof output !== 'string' || output.length === 0) return null;

        try {
            const result: T = JSON.parse(output);
            return result;
        } catch (error) {
            console.error('Error while parse windows ram output', error);
            return null;
        }
    }

    /**
     * @param {Record<string, number>} ramObj
     * @returns {ISpciRamFields | null}
     */
    private fillRamInfoFields(ramObj: Record<string, number>): ISpciRamFields | null {
        try {
            let swaptotal = get(ramObj, 'AllocatedBaseSize', 0);
            if (swaptotal !== 0) {
                // Convert KB to B
                swaptotal = swaptotal * 1024 * 1024;
            }

            let swapused = get(ramObj, 'CurrentUsage', 0);
            if (swapused !== 0) {
                // Convert KB to B
                swapused = swapused * 1024 * 1024;
            }

            let swapfree = 0;
            if (swaptotal !== 0 && swapused !== 0) {
                swapfree = swaptotal - swapused;
            }

            const ramInfo: ISpciRamFields = {
                ...this.RAM_INFO_FIELDS,
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem(),
                active: os.totalmem() - os.freemem(),
                available: os.freemem(),
                swaptotal,
                swapused,
                swapfree,
            };

            return ramInfo;
        } catch (error) {
            console.error('Error while fill ram info fields', error);
            return null;
        }
    }

    /**
     * @param {Record<string, string>} ramObj
     * @returns {ISpciRamLayoutFields | null}
     */
    private fillRamLayoutFields(ramObj: Record<string, string>): ISpciRamLayoutFields | null {
        try {
            const dataWidth = get(ramObj, 'DataWidth', 0);
            const totalWidth = get(ramObj, 'TotalWidth', 0);

            const ramLayout: ISpciRamLayoutFields = {
                ...this.RAM_LAYOUT_FIELDS,
                size: get(ramObj, 'Capacity', null),
                bank: get(ramObj, 'BankLabel', null),
                slot: RamSlot.determinateSlotNumber(get(ramObj, 'Tag', null)),
                type: MemotyType.determinateMemotyType(
                    get(ramObj, 'MemoryType', 0) as number,
                    get(ramObj, 'SMBIOSMemoryType', 0) as number,
                ),
                ecc: dataWidth && totalWidth ? totalWidth > dataWidth : false,
                clockSpeed: get(ramObj, 'ConfiguredClockSpeed', null),
                formFactor: FormFactor.determinateFormFactor(get(ramObj, 'FormFactor', 0) as number),
                manufacturer: get(ramObj, 'Manufacturer', null),
                partNum: get(ramObj, 'PartNumber', null),
                serialNum: get(ramObj, 'SerialNumber', null),
                voltageConfigured: get(ramObj, 'ConfiguredVoltage', null),
                voltageMin: get(ramObj, 'MinVoltage', null),
                voltageMax: get(ramObj, 'MaxVoltage', null),
            };

            return ramLayout;
        } catch (error) {
            console.error('Error while fill ram layout fields', error);
            return null;
        }
    }

    /**
     * @returns {Promise<ISpciRamLayoutFields[]>}
     */
    private async getRamLayoutFromTerminal(): Promise<ISpciRamLayoutFields[]> {
        return new Promise((resolve, reject) => {
            const result: ISpciRamLayoutFields[] = [];
            const responce = shelljs.exec(`powershell.exe -Command "${this.CMD_RAM_LAYOUT}"`, {
                async: false,
                silent: true,
            });

            if (responce.code !== 0) {
                console.error('Error while get data from terminal. Code:', responce.code);
                reject(responce.stderr);
            }

            const ramLayouts = this.parseOutput<Record<string, string>[]>(responce.stdout);
            if (ramLayouts === null) {
                reject(new Error('Error while parse windows output'));
            }

            ramLayouts.forEach(ram => {
                const ramStrip = this.fillRamLayoutFields(ram);

                if (ramStrip !== null) {
                    result.push(ramStrip);
                }
            });

            resolve(result);
        });
    }

    /**
     * @returns {Promise<ISpciRamFields | null>}
     */
    private async getRamInfoFromTerminal(): Promise<ISpciRamFields | null> {
        return new Promise((resolve, reject) => {
            const responce = shelljs.exec(`powershell.exe -Command "${this.CMD_RAM_INFO}"`, {
                async: false,
                silent: true,
            });

            if (responce.code !== 0) {
                console.error('Error while get data from terminal. Code:', responce.code);
                reject(responce.stderr);
            }

            const ramInfo = this.parseOutput<Record<string, number>>(responce.stdout);
            if (ramInfo === null) {
                reject(new Error('Error while parse windows output'));
            }

            const result: ISpciRamFields = this.fillRamInfoFields(ramInfo);

            resolve(result);
        });
    }

    /**
     * Get windows ram base information
     * @returns {Promise<ISpciRamFields | null>}
     */
    public async getInfo(): Promise<ISpciRamFields | null> {
        const result = await this.getRamInfoFromTerminal();
        return result;
    }

    /**
     * Get windows ram layouts
     * @returns {Promise<ISpciRamLayoutFields>}
     */
    public async getLayout(): Promise<ISpciRamLayoutFields[]> {
        const result = await this.getRamLayoutFromTerminal();
        return result;
    }
}

export default Windows;
