# RAM
This class returned info of RAM

### Supported fields of RAM
| Name          | Type            | Linux | Mac OS | Windows (10+) | Description                                                 |
|---------------|-----------------|-------|--------|---------------|-------------------------------------------------------------|
|`total`        | number \| null  | ❌    | ✅    | ✅            | Total amount of RAM available in the system.                |
|`free`         | number \| null  | ❌    | ✅    | ✅            | Amount of unused RAM in the system.                         |
|`used`         | number \| null  | ❌    | ✅    | ✅            | Amount of RAM currently in use.                             |
|`active`       | number \| null  | ❌    | ✅    | ✅            | Amount of RAM actively used recently.                       |
|`available`    | number \| null  | ❌    | ✅    | ✅            | Amount of RAM available for allocation.                     |
|`buffers`      | number \| null  | ❌    | ❌    | ✅            | Amount of memory used for buffers by the system.            |
|`cached`       | number \| null  | ❌    | ✅    | ❌            | Amount of RAM used for disk caching.                        |
|`slab`         | number \| null  | ❌    | ❌    | ❌            | Amount of RAM used by the kernel for data structures.       |
|`buffcache`    | number \| null  | ❌    | ❌    | ❌            | Sum of buffers and cached memory.                           |
|`swaptotal`    | number \| null  | ❌    | ✅    | ✅            | Total amount of swap space available.                       |
|`swapused`     | number \| null  | ❌    | ✅    | ✅            | Amount of swap space currently in use.                      |
|`swapfree`     | number \| null  | ❌    | ✅    | ✅            | Amount of unused swap space.                                |
|`writeback`    | number \| null  | ❌    | ❌    | ❌            | Amount of "dirty" pages that are yet to be written to disk. |
|`dirty`        | number \| null  | ❌    | ❌    | ❌            | Amount of memory waiting to be written to disk.             |
|`wired`        | number \| null  | ❌    | ✅    | ❌            | Amount of RAM that cannot be paged out (kernel, GPU on Apple Silicon). |
|`compressed`   | number \| null  | ❌    | ✅    | ❌            | Amount of RAM used by the memory compressor (matches Activity Monitor). |

### Supported fields of RAM layouts
| Name              | Type             | Linux | Mac OS (Intel) | Mac OS (ARM) | Windows (10+) | Description                                                    |
|-------------------|------------------|-------|----------------|--------------|---------------|----------------------------------------------------------------|
|`size`             | number \| null   | ❌    | ✅             | ✅           | ✅            | Size of the RAM module.                                        |
|`bank`             | string \| null   | ❌    | ✅             | ❌           | ✅            | Bank or slot number where the RAM module is installed.         |
|`type`             | string \| null   | ❌    | ✅             | ✅           | ✅            | Type of RAM module (e.g., DDR4, LPDDR5).                       |
|`ecc`              | boolean \| null  | ❌    | ❌             | ❌           | ✅            | Whether the RAM module has error-correcting code (ECC) support.|
|`clockSpeed`       | number \| null   | ❌    | ✅             | ❌           | ✅            | Clock speed of the RAM module.                                 |
|`formFactor`       | boolean \| null  | ❌    | ✅             | ❌           | ✅            | Form factor of the RAM module.                                 |
|`manufacturer`     | string \| null   | ❌    | ✅             | ✅           | ✅            | Manufacturer of the RAM module.                                |
|`partNum`          | string \| null   | ❌    | ✅             | ❌           | ✅            | Part number of the RAM module.                                 |
|`serialNum`        | string \| null   | ❌    | ✅             | ❌           | ✅            | Serial number of the RAM module.                               |
|`voltageConfigured`| number \| null   | ❌    | ❌             | ❌           | ✅            | Configured voltage of the RAM module.                          |
|`voltageMin`       | number \| null   | ❌    | ❌             | ❌           | ✅            | Minimum voltage supported by the RAM module.                   |
|`voltageMax`       | number \| null   | ❌    | ❌             | ❌           | ✅            | Maximum voltage supported by the RAM module.                   |
|`slot`             | number \| null   | ❌    | ✅             | ❌           | ✅            | Physical slot number where the RAM module is installed.        |

*`bank` and `slot` may contain the same information, but some versions of the OS return the same bank for each RAM module.*

*On Apple Silicon (ARM), RAM is unified memory integrated into the SoC — there are no physical DIMM slots, so layout returns a single entry with only `size`, `type`, and `manufacturer`.*

### How to use

#### RAM info
```tsx
const myRam = async () => {
    const ram = new Ram();
    const info = await ram.getInfo();

    console.log(info);
    // {
    //     total: 34110332928,
    //     free: 25221632000,
    //     used: 8888700928,
    //     active: 8888700928,
    //     available: 25221632000,
    //     buffers: null,
    //     cached: null,
    //     slab: null,
    //     buffcache: null,
    //     swaptotal: 2147483648,
    //     swapused: 0,
    //     swapfree: 0,
    //     writeback: null,
    //     dirty: null
    // }
};
```

#### RAM layout
```tsx
const myRam = async () => {
    const ram = new Ram();
    const layout = await ram.getLayout();

    console.log(layout);
    // [
    //     {
    //         size: 17179869184,
    //         bank: 'BANK 0',
    //         slot: 1,
    //         type: 'DDR5',
    //         ecc: false,
    //         clockSpeed: 6400,
    //         formFactor: 'DIMM',
    //         manufacturer: 'Kingston',
    //         partNum: 'KF564C32-16',
    //         serialNum: '5******4',
    //         voltageConfigured: 1400,
    //         voltageMin: 1100,
    //         voltageMax: 1400
    //     },
    //     {
    //         size: 17179869184,
    //         bank: 'BANK 0',
    //         slot: 3,
    //         type: 'DDR5',
    //         ecc: false,
    //         clockSpeed: 6400,
    //         formFactor: 'DIMM',
    //         manufacturer: 'Kingston',
    //         partNum: 'KF564C32-16',
    //         serialNum: '6******1',
    //         voltageConfigured: 1400,
    //         voltageMin: 1100,
    //         voltageMax: 1400
    //     }
    // ]
};
