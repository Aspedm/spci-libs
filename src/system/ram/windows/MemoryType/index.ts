class MemotyType {
    // https://www.dmtf.org/sites/default/files/standards/documents/DSP0134_3.4.0a.pdf
    private static MEMOTY_TYPES: string[] = [
        'Unknown',
        'Other',
        'DRAM',
        'Synchronous DRAM',
        'Cache DRAM',
        'EDO',
        'EDRAM',
        'VRAM',
        'SRAM',
        'RAM',
        'ROM',
        'FLASH',
        'EEPROM',
        'FEPROM',
        'EPROM',
        'CDRAM',
        '3DRAM',
        'SDRAM',
        'SGRAM',
        'RDRAM',
        'DDR',
        'DDR2',
        'DDR2 FB-DIMM',
        'Reserved',
        'DDR3',
        'FBD2',
        'DDR4',
        'LPDDR',
        'LPDDR2',
        'LPDDR3',
        'LPDDR4',
        'Logical non-volatile device',
        'HBM',
        'HBM2',
        'DDR5',
        'LPDDR5',
    ];

    /**
     * @param {number} memoryType
     * @param {number} SMBIOSMemoryType
     * @returns {@returns {string}}
     */
    static determinateMemotyType(memoryType: number, SMBIOSMemoryType: number): string {
        if (typeof memoryType !== 'number' || typeof SMBIOSMemoryType !== 'number') return this.MEMOTY_TYPES[0];

        const firstTry = this.MEMOTY_TYPES[memoryType];
        if (typeof firstTry === 'undefined') return this.MEMOTY_TYPES[0];
        if (firstTry !== 'Unknown') return firstTry;

        const secondTry = this.MEMOTY_TYPES[SMBIOSMemoryType];
        if (typeof secondTry === 'undefined') return this.MEMOTY_TYPES[0];
        return secondTry;
    }
}

export default MemotyType;
