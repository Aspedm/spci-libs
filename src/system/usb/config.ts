import { ISpciUsbDevice } from './interface';

export const MAX_BUFFER: number = 1024 * 1024 * 128;

export const DEFAULT_FIELDS_VALUES: ISpciUsbDevice = {
    bus: null,
    deviceId: null,
    id: null,
    name: null,
    type: null,
    removable: null,
    vendor: null,
    manufacturer: null,
    maxPower: null,
    serialNumber: null,
};

export enum USB_DEVICE_TYPE {
    CAMERA = 'Camera',
    TOUCH_BAR = 'Touch Bar',
    CONTROLLER = 'Controller',
    AUDIO = 'Audio',
    PHONE = 'Phone',
    TABLET = 'Tablet',
    CONSOLE = 'Gaming console',
    MAGSAFE = 'MagSafe',
    KEYBOARD = 'Keyboard',
    TRACKPAD = 'Trackpad',
    SENSOR = 'Sensor',
    BLUETOOTH = 'Bluetooth',
    HUB = 'Hub',
    MOUSE = 'Mouse',
    MICROPHONE = 'Microphone',
    STORAGE = 'Storage',
}
