export interface ISpciRamFields {
    total: number | null;
    free: number | null;
    used: number | null;
    active: number | null;
    available: number | null;
    buffers: number | null;
    cached: number | null;
    slab: number | null;
    buffcache: number | null;
    swaptotal: number | null;
    swapused: number | null;
    swapfree: number | null;
    writeback: number | null;
    dirty: number | null;
    wired: number | null;
    compressed: number | null;
}

export interface ISpciRamLayoutFields {
    size: number | null;
    bank: string | null;
    type: string | null;
    ecc: boolean | null;
    clockSpeed: number | null;
    formFactor: string | null;
    manufacturer: string | null;
    partNum: string | null;
    serialNum: string | null;
    voltageConfigured: number | null;
    voltageMin: number | null;
    voltageMax: number | null;
    slot: number | null;
}

export interface ISpciRam {
    getInfo: () => Promise<ISpciRamFields | null>;
    getLayout: () => Promise<ISpciRamLayoutFields[]>;
}
