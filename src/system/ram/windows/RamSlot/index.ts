class RamSlot {
    /**
     * @param {string} tag
     * @returns { number | null}
     */
    static determinateSlotNumber(tag: string): number | null {
        if (typeof tag !== 'string') return null;

        try {
            const matchedResult = tag.match(/\d+/)[0];
            const result = parseInt(matchedResult, 10);
            if (Number.isNaN(result)) return null;

            return result;
        } catch {
            return null;
        }
    }
}

export default RamSlot;
