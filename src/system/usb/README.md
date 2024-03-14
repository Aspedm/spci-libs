# USB
This class returned array of detected USB devices

### Supported fields
| Name          | Type            | Linux | MacOS (macOS Mojave and higher) | Windows (10+) | Description                                       |
|---------------|-----------------|-------|----------------------------------|---------------|---------------------------------------------------|
|`bus`          | string \| null  | ❌    | ✅                                | ❌            | Identifies the USB bus the device is connected to |
|`deviceId`     | string \| null  | ❌    | ✅                                | ✅            | Unique identifier assigned to the USB device      |
|`id`           | string \| null  | ❌    | ✅                                | ✅            | Unique identifier for the USB device              |
|`name`         | string \| null  | ❌    | ✅                                | ✅            | Human-readable name of the USB device             |
|`type`         | string \| null  | ❌    | ✅                                | ✅            | Categorizes the USB device based on functionality |
|`removable`    | boolean \| null | ❌    | ✅*                               | ❌            | Indicates if the device is removable              |
|`vendor`       | string \| null  | ❌    | ✅                                | ❌            | Identifies the vendor                             |
|`manufacturer` | string \| null  | ❌    | ✅                                | ✅            | Specifies the device's manufacturer.              |
|`maxPower`     | string \| null  | ❌    | ✅                                | ❌            | Maximum power the device can draw (in mA)         |
|`serialNumber` | string \| null  | ❌    | ✅                                | ❌            | Unique serial number assigned by the manufacturer |

*\* Field `removable` supported only for device with type Storage.*

### Supported usb types
#### MacOS
- Camera
- Touch Bar
- Controller
- Audio
- Phone
- Tablet
- Gaming console
- MagSafe
- Headset
- Keyboard
- Trackpad
- Sensor
- Storage
- Bluetooth
- Hub
- Mouse
- Microphone
- Printer
- USB device

#### Windows
- iphone
- ipad
- magsafe
- earpods
- usbstor
- usbaudio
- disk
- usbhub
- bthusb
- usbccgp
- wudfwpdmtp
- controller

All device types are defined in the USB_DEVICE_TYPE enum.

### How to use

```tsx
const myUsbDevices = async () => {
    const usb = new Usb();
    const devices = await usb.getDevices();

    console.log(devices);
    // [
    //     {
    //         bus: '1',
    //         deviceId: '0x55ab',
    //         id: 'irwzml2tcj',
    //         name: 'SanDisk 3.2Gen1',
    //         type: 'Storage',
    //         removable: true,
    //         vendor: '0x0781  (SanDisk Corporation)',
    //         manufacturer: 'USB',
    //         maxPower: '900',
    //         serialNumber: '0********9'
    //     }
    // ]

};
```