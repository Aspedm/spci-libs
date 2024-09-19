import { ISpciPciDevice } from './interface';

export const MAX_BUFFER: number = 1024 * 1024 * 128;

export const DEFAULT_FIELDS_VALUES: ISpciPciDevice = {
    id: null,
    class: null,
    friendlyName: null,
    instanceId: null,
    deviceID: null,
    problem: null,
    configManagerErrorCode: null,
    problemDescription: null,
    name: null,
    description: null,
    status: null,
    manufacturer: null,
    pnpClass: null,
    present: false,
};
