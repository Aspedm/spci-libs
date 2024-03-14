class DeviceVendor {
    // USB Vendors data base https://the-sz.com/products/usbid/index.php?v=&p=&n=
    private static USB_VENDORS_IDS: Record<string, string> = {
        apple_vendor_id: 'Apple Computer, Inc.',
    };

    /**
     * @param {string} vendorId
     * @returns {string}
     */
    public static determinateVendor(vendorId: string): string {
        if (typeof vendorId !== 'string') return vendorId;

        const result = this.USB_VENDORS_IDS[vendorId];
        if (typeof result === 'undefined') return vendorId;

        return result;
    }
}

export default DeviceVendor;
