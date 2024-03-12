# USB
This class returned array of detected USB devices

### Supported fields
| Name          | Type            | Linux | Mac OS | Windows (10+) | Description                                       |
|---------------|-----------------|-------|--------|---------------|---------------------------------------------------|
|`bus`          | string \| null  | ❌    | ❌    | ❌            | Identifies the USB bus the device is connected to |
|`deviceId`     | string \| null  | ❌    | ❌    | ✅            | Unique identifier assigned to the USB device      |
|`id`           | string \| null  | ❌    | ✅    | ✅            | Unique identifier for the USB device              |
|`name`         | string \| null  | ❌    | ✅    | ✅            | Human-readable name of the USB device             |
|`type`         | string \| null  | ❌    | ✅    | ✅            | Categorizes the USB device based on functionality |
|`removable`    | boolean \| null | ❌    | ✅    | ❌            | Indicates if the device is removable              |
|`vendor`       | string \| null  | ❌    | ✅    | ❌            | Identifies the vendor                             |
|`manufacturer` | string \| null  | ❌    | ✅    | ✅            | Specifies the device's manufacturer.              |
|`maxPower`     | string \| null  | ❌    | ❌    | ❌            | Maximum power the device can draw (in mA)         |
|`serialNumber` | string \| null  | ❌    | ✅    | ❌            | Unique serial number assigned by the manufacturer |

### Supported usb types
#### Mac OS
- camera
- touch bar
- controller
- headset
- iphone
- ipad
- nintendo
- magsafe
- earpods
- keyboard
- trackpad
- sensor
- bthusb
- bth
- rfcomm
- usbhub
- hub
- mouse
- mic
- removable

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
    //         "bus": null,
    //         "deviceId": null,
    //         "id": 1,
    //         "name": "Silicon-Power4G",
    //         "type": "Storage",
    //         "removable": true,
    //         "vendor": "UFD 2.0",
    //         "manufacturer": "UFD 2.0",
    //         "maxPower": null,
    //         "serialNumber": "2011.....FB"
    //     }
    // ]
};
```