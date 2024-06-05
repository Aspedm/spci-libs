// Ram
import Ram from './system/ram';
import { ISpciRamFields, ISpciRamLayoutFields } from './system/ram/interfaces';
// Usb
import Usb from './system/usb';
import { USB_DEVICE_TYPE } from './system/usb/config';
import { ISpciUsbDevice } from './system/usb/interface';
// Wallpaper
import Wallpaper from './system/wallpaper';

// Export modules
export { Usb, Ram, Wallpaper };

// Export enums
export { USB_DEVICE_TYPE };

// Export types
export { ISpciUsbDevice, ISpciRamFields, ISpciRamLayoutFields };
