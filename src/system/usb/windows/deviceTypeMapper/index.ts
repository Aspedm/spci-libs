import { USB_DEVICE_TYPE } from '../../config';

class DeviceTypeMapper {
    private static WINDOWS_DEVICE_TYPES_MAP: Record<string, USB_DEVICE_TYPE> = {
        iphone: USB_DEVICE_TYPE.PHONE,
        ipad: USB_DEVICE_TYPE.TABLET,
        magsafe: USB_DEVICE_TYPE.MAGSAFE,
        earpods: USB_DEVICE_TYPE.HEADSET,
        usbstor: USB_DEVICE_TYPE.STORAGE,
        usbaudio: USB_DEVICE_TYPE.AUDIO,
        disk: USB_DEVICE_TYPE.STORAGE,
        usbhub: USB_DEVICE_TYPE.HUB,
        bthusb: USB_DEVICE_TYPE.BLUETOOTH,
        usbccgp: USB_DEVICE_TYPE.USB_COMPOSITE_DEVICE,
        wudfwpdmtp: USB_DEVICE_TYPE.PHONE,
        controller: USB_DEVICE_TYPE.CONTROLLER,
    };

    /**
     * Map windows style usb device type to universal format
     * @param {string} type
     * @param {string} service
     * @returns {string}
     */
    public static getFriendlyNameType(type: string, service: string): string {
        if (typeof type !== 'string') return type;

        const foundDevice = Object.keys(this.WINDOWS_DEVICE_TYPES_MAP).find(keyword => type.includes(keyword));

        return foundDevice ? this.WINDOWS_DEVICE_TYPES_MAP[foundDevice] : service;
    }
}

export default DeviceTypeMapper;
