class DeviceBus {
    /**
     * @param {string} locationId
     * @returns {string | null}
     */
    public static determinateBus(locationId: string): string | null {
        if (typeof locationId !== 'string') return null;

        const values = locationId.split('/');
        const bus = values[1];
        if (typeof bus === 'undefined') return null;

        return bus.trim();
    }
}

export default DeviceBus;
