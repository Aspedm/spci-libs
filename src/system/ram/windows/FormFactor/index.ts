class FormFactor {
    // https://www.dmtf.org/sites/default/files/standards/documents/DSP0134_3.4.0a.pdf
    private static FORM_FACTORS: string[] = [
        'Unknown',
        'Other',
        'SIP',
        'DIP',
        'ZIP',
        'SOJ',
        'Proprietary',
        'SIMM',
        'DIMM',
        'TSOP',
        'PGA',
        'RIMM',
        'SODIMM',
        'SRIMM',
        'SMD',
        'SSMP',
        'QFP',
        'TQFP',
        'SOIC',
        'LCC',
        'PLCC',
        'BGA',
        'FPBGA',
        'LGA',
    ];

    /**
     * @param {number} formFactorId
     * @returns {string}
     */
    static determinateFormFactor(formFactorId: number): string {
        if (typeof formFactorId !== 'number') return this.FORM_FACTORS[0];

        const result = this.FORM_FACTORS[formFactorId];
        if (typeof result === 'undefined') return this.FORM_FACTORS[0];

        return result;
    }
}

export default FormFactor;
