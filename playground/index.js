import { Usb, Ram } from '../dist/index.es.js';

// const getUsbDevices = async () => {
//     const usb = new Usb();
//     const devices = await usb.getDevices();

//     console.log('devices', devices);
// };

// getUsbDevices();

const getRamInfo = async () => {
    const ram = new Ram();
    const info = await ram.getInfo();

    console.log('info', info);
};

getRamInfo();

// const getRamLayout = async () => {
//     const ram = new Ram();
//     const layouts = await ram.getLayout();

//     console.log('layouts', layouts);
// };

// getRamLayout();