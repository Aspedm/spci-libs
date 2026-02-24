import { ISpciRamFields, ISpciRamLayoutFields } from './interfaces';

export const DEFAULT_RAM_LAYOUT_FIELDS: ISpciRamLayoutFields = {
    size: null,
    bank: null,
    slot: null,
    type: null,
    ecc: null,
    clockSpeed: null,
    formFactor: null,
    manufacturer: null,
    partNum: null,
    serialNum: null,
    voltageConfigured: null,
    voltageMin: null,
    voltageMax: null,
};

export const DEFAULT_RAM_INFO_FIELDS: ISpciRamFields = {
    total: null,
    free: null,
    used: null,
    active: null,
    available: null,
    buffers: null,
    cached: null,
    slab: null,
    buffcache: null,
    swaptotal: null,
    swapused: null,
    swapfree: null,
    writeback: null,
    dirty: null,
    wired: null,
    compressed: null,
};
