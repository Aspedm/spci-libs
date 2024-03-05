import { Usb } from '../dist/index.es.js';

const getUsbDevices = async () => {
    const usb = new Usb();
    const devices = await usb.getDevices();

    console.log('devices', devices);
};

getUsbDevices();