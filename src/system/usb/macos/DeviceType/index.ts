import { USB_DEVICE_TYPE } from '../../config';

class DeviceTypeMapper {
    private static MAC_OS_DEVICE_TYPES_MAP: Record<string, USB_DEVICE_TYPE> = {
        camera: USB_DEVICE_TYPE.CAMERA,
        'touch bar': USB_DEVICE_TYPE.TOUCH_BAR,
        controller: USB_DEVICE_TYPE.CONTROLLER,
        headset: USB_DEVICE_TYPE.HEADSET,
        iphone: USB_DEVICE_TYPE.PHONE,
        ipad: USB_DEVICE_TYPE.TABLET,
        nintendo: USB_DEVICE_TYPE.CONSOLE,
        magsafe: USB_DEVICE_TYPE.MAGSAFE,
        earpods: USB_DEVICE_TYPE.HEADSET,
        keyboard: USB_DEVICE_TYPE.KEYBOARD,
        trackpad: USB_DEVICE_TYPE.TRACKPAD,
        sensor: USB_DEVICE_TYPE.SENSOR,
        disk: USB_DEVICE_TYPE.STORAGE,
        printer: USB_DEVICE_TYPE.PRINTER,
        bthusb: USB_DEVICE_TYPE.BLUETOOTH,
        bth: USB_DEVICE_TYPE.BLUETOOTH,
        rfcomm: USB_DEVICE_TYPE.BLUETOOTH,
        usbhub: USB_DEVICE_TYPE.HUB,
        hub: USB_DEVICE_TYPE.HUB,
        mouse: USB_DEVICE_TYPE.MOUSE,
        mic: USB_DEVICE_TYPE.MICROPHONE,
    };

    /**
     * Map Mac OS style usb device type to universal format
     * @param {string} name - _name of SPUSBDataType class
     * @param {Record<string, unknown> | null} media - Media of SPUSBDataType class
     * @returns {string}
     */
    public static determinateType(name: string, media: Record<string, unknown> | null): string {
        if (media !== null) return USB_DEVICE_TYPE.STORAGE;
        if (typeof name !== 'string') return USB_DEVICE_TYPE.USB;

        const query = name.toLocaleLowerCase();
        const typeKeys = Object.keys(this.MAC_OS_DEVICE_TYPES_MAP);

        const result = typeKeys.find(keyword => query.includes(keyword));
        if (typeof result === 'undefined') return USB_DEVICE_TYPE.USB;

        return this.MAC_OS_DEVICE_TYPES_MAP[result];
    }
}

export default DeviceTypeMapper;
