# @spci/libs

### About
This project containts libs to get information about system.

> This project does not aim to cover all modules of the system. If you need more information about the system, i recommend using [systeminformation](https://github.com/sebhildebrandt/systeminformation).

### Supported modules

#### USB
| Name          | Type            | Linux | Mac OS | Windows | Description                                       |
|---------------|-----------------|-------|--------|---------|---------------------------------------------------|
|`bus`          | string \| null  | ✅    | ❌      | ❌      | Identifies the USB bus the device is connected to |
|`deviceId`     | string \| null  | ✅    | ❌      | ❌      | Unique identifier assigned to the USB device      |
|`id`           | string \| null  | ✅    | ✅      | ✅      | Unique identifier for the USB device              |
|`name`         | string \| null  | ✅    | ✅      | ✅      | Human-readable name of the USB device             |
|`type`         | string \| null  | ✅    | ✅      | ✅      | Categorizes the USB device based on functionality |
|`removable`    | boolean \| null | ✅    | ✅      | ❌      | Indicates if the device is removable              |
|`vendor`       | string \| null  | ✅    | ✅      | ❌      | Identifies the vendor                             |
|`manufacturer` | string \| null  | ✅    | ✅      | ✅      | Specifies the device's manufacturer.              |
|`maxPower`     | string \| null  | ✅    | ❌      | ❌      | Maximum power the device can draw (in mA)         |
|`serialNumber` | string \| null  | ✅    | ✅      | ❌      | Unique serial number assigned by the manufacturer |

### Install
```sh
yarn install @spci/libs
```

### Usage
```ts
import { Usb } from '@spci/libs';

const myUsbDevices = async() => {
    const usb = new Usb();
    const devices = await usb.getDevices();

    console.log(devices);
};
```

### TODO
- [ ] Support linux USB devices
- [ ] Support windows USB devices

### License
Further details see [LICENSE](LICENSE) file.


### Contact
If you have any questions, suggestions, or issues, please create an issue in the GitHub repository or contact me at [aspedm@gmail.com](mailto:aspedm@gmail.com).


### Credits
A big thanks to:
- [systeminformation](https://github.com/sebhildebrandt/systeminformation) - Library based and inspired on systeminformation 