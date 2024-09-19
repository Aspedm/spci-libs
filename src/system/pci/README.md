# PCI
This class returned array of detected PCI devices

### Supported fields
| Name                    | Type              | Linux | MacOS (macOS Mojave and higher) | Windows (10+) | Description                                                   |
|-------------------------|-------------------|-------|----------------------------------|---------------|--------------------------------------------------------------|
|`class`                  | string \| null    | ❌    | ❌                              | ✅            | Identifies the PCI device class                              |
|`friendlyName`           | string \| null    | ❌    | ❌                              | ✅            | Human-readable name of the PCI device                        |
|`instanceId`             | string \| null    | ❌    | ❌                              | ✅            | Unique identifier for the PCI device                         |
|`problem`                | number \| null    | ❌    | ❌                              | ✅            | Indicates if there are any problems with the PCI device      |
|`configManagerErrorCode` | number \| null    | ❌    | ❌                              | ✅            | Error code assigned by the configuration manager             |
|`problemDescription`     | string \| null    | ❌    | ❌                              | ✅            | Description of the problem (if any)                          |
|`name`                   | string \| null    | ❌    | ❌                              | ✅            | Human-readable name assigned to the PCI device               |
|`description`            | string \| null    | ❌    | ❌                              | ✅            | Full description of the PCI device                           |
|`status`                 | string \| null    | ❌    | ❌                              | ✅            | Current status of the PCI device                             |
|`manufacturer`           | string \| null    | ❌    | ❌                              | ✅            | Manufacturer of the PCI device                               |
|`pnpClass`               | string \| null    | ❌    | ❌                              | ✅            | Plug and Play class for the PCI device                       |
|`present`                | boolean \| null   | ❌    | ❌                              | ✅            | Indicates whether the PCI device is currently present        |

### How to use

```tsx
const myPciDevices = async () => {
    const pci = new Pci();
    const devices = await pci.getDevices();

    console.log(devices);
    // {
    //     id: '16',
    //     class: 'System',
    //     friendlyName: 'Microsoft Hyper-V PCI Server',
    //     instanceId: 'ROOT\\0000',
    //     deviceID: 'ROOT\\0000',
    //     problem: 0,
    //     configManagerErrorCode: 0,
    //     problemDescription: null,
    //     name: 'Microsoft Hyper-V PCI Server',
    //     description: 'Microsoft Hyper-V PCI Server',
    //     status: 'OK',
    //     manufacturer: 'Microsoft',
    //     pnpClass: 'System',
    //     present: true
    // }
};
```
