import { USB_DEVICE_TYPE } from '../../config';

class DeviceTypeMapper {
    private static MAC_OS_DEVICE_TYPES_MAP: Record<string, USB_DEVICE_TYPE> = {
        camera: USB_DEVICE_TYPE.CAMERA,
        'touch bar': USB_DEVICE_TYPE.TOUCH_BAR,
        controller: USB_DEVICE_TYPE.CONTROLLER,
        headset: USB_DEVICE_TYPE.AUDIO,
        iphone: USB_DEVICE_TYPE.PHONE,
        ipad: USB_DEVICE_TYPE.TABLET,
        nintendo: USB_DEVICE_TYPE.CONSOLE,
        magsafe: USB_DEVICE_TYPE.MAGSAFE,
        keyboard: USB_DEVICE_TYPE.KEYBOARD,
        trackpad: USB_DEVICE_TYPE.TRACKPAD,
        sensor: USB_DEVICE_TYPE.SENSOR,
        bthusb: USB_DEVICE_TYPE.BLUETOOTH,
        bth: USB_DEVICE_TYPE.BLUETOOTH,
        rfcomm: USB_DEVICE_TYPE.BLUETOOTH,
        usbhub: USB_DEVICE_TYPE.HUB,
        hub: USB_DEVICE_TYPE.HUB,
        mouse: USB_DEVICE_TYPE.MOUSE,
        mic: USB_DEVICE_TYPE.MICROPHONE,
        removable: USB_DEVICE_TYPE.STORAGE,
    };

    /**
     * Map Mac OS style usb device type to universal format
     * @param {string} type
     * @returns {string}
     */
    public static getFriendlyNameType(type: string): string {
        if (typeof type !== 'string') return type;

        const foundDevice = Object.keys(this.MAC_OS_DEVICE_TYPES_MAP).find(keyword => type.includes(keyword));

        return foundDevice ? this.MAC_OS_DEVICE_TYPES_MAP[foundDevice] : type;
    }
}

export default DeviceTypeMapper;
