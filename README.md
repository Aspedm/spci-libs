# spci-libs

### About
This project containts libs to get information about system.

> This project does not aim to cover all modules of the system. If you need more information about the system, i recommend using [systeminformation](https://github.com/sebhildebrandt/systeminformation).

### Supported modules

#### USB
- The documentation for USB devices can be found [here](https://github.com/Aspedm/spci-libs/blob/main/src/system/usb/README.md)

#### RAM
- The documentation for RAM can be found [here](https://github.com/Aspedm/spci-libs/blob/main/src/system/ram/README.md)

### Install
```sh
yarn install spci-libs
```

### Usage
```ts
import { Usb } from 'spci-libs';

const myUsbDevices = async() => {
    const usb = new Usb();
    const devices = await usb.getDevices();

    console.log(devices);
};
```

### Development
1. Install dependencies ```yarn```
2. Build lib ```yarn build```
3. Run playground ```yarn start```

### TODO
#### USB
- [ ] Support Linux
- [X] Support Mac OS
- [X] Support Windows

#### RAM
- [ ] Support linux
- [ ] Support Mac OS
- [X] Support Windows

#### Audio
- [ ] Support linux
- [ ] Support Mac OS
- [ ] Support Windows

#### Playground
- [ ] Improve playground

### License
Further details see [LICENSE](LICENSE) file.


### Contact
If you have any questions, suggestions, or issues, please create an issue in the GitHub repository or contact me at [aspedm@gmail.com](mailto:aspedm@gmail.com).


### Credits
A big thanks to:
- [systeminformation](https://github.com/sebhildebrandt/systeminformation) - Library based and inspired on systeminformation 
