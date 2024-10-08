import fs from 'fs';
import chalk from 'chalk';
import select from '@inquirer/select';

const error = chalk.bold.red;
const success = chalk.bold.green;
const BUILD_PATH = './dist/index.es.js'

/**
 * @param {string} filePath 
 * @returns {boolean}
 */
const checkBuildExist = (filePath) => {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
};

const buildExist = checkBuildExist(BUILD_PATH);

if (!buildExist) {
    console.log('');
    console.log(error('============== RUN FAILED =============='));
    console.log('');
    console.log('Please. Run build script <yarn build>');
    console.log('');
    console.log(error('========================================'));
    console.log('');
} else {
    try {
        const SYSTEM = await import(`.${BUILD_PATH}`);

        console.log('');
        console.log(success('✨ Build was found'));
        console.log('');

        /**
         * Select system module
         */
        const selectedModule = await select({
            message: 'Select system module',
            choices: [
                {
                    name: 'USB',
                    value: 'usb',
                    description: 'This class returned array of detected USB devices',
                },
                {
                    name: 'RAM',
                    value: 'ram',
                    description: 'This class returned info of RAM',
                },
                {
                    name: 'PCI',
                    value: 'pci',
                    description: 'This class returned array of detected PCI devices',
                },
                {
                    name: 'Wallpaper',
                    value: 'wallpaper',
                    description: 'This class returned current wallpaper',
                },
            ],
        });

        /**
         * Select USB method
         */
        if (selectedModule === 'usb') {
            const selectedMethod = await select({
                message: 'Select USB module',
                choices: [
                    {
                        name: 'getInfo()',
                        value: 'getInfo',
                        description: 'This method returns an array of USB devices.',
                    },
                ],
            });

            // getInfo()
            if (selectedMethod === 'getInfo') {
                const usb = new SYSTEM.Usb();
                const devices = await usb.getDevices();

                console.log('');
                console.log('USB devices:');
                console.log(devices);
                console.log('');
            }
        }

        /**
         * Select RAM method
         */
        if (selectedModule === 'ram') {
            const selectedMethod = await select({
                message: 'Select USB module',
                choices: [
                    {
                        name: 'getRamInfo()',
                        value: 'getRamInfo',
                        description: 'This method returns an object containing RAM fields or null if information is unavailable.',
                    },
                    {
                        name: 'getLayout()',
                        value: 'getLayout',
                        description: 'This method returns an array of RAM layout fields.',
                    },
                ],
            });

            // getRamInfo
            if (selectedMethod === 'getRamInfo') {
                const ram = new SYSTEM.Ram();
                const info = await ram.getInfo();

                console.log('');
                console.log('RAM info:');
                console.log(info);
                console.log('');
            }

            // getLayout
            if (selectedMethod === 'getLayout') {
                const ram = new SYSTEM.Ram();
                const layout = await ram.getLayout();

                console.log('');
                console.log('RAM layout:');
                console.log(layout);
                console.log('');
            }
        }

        /**
         * Select PCI method
         */
        if (selectedModule === 'pci') {
            const selectedMethod = await select({
                message: 'Select PCI module',
                choices: [
                    {
                        name: 'getInfo()',
                        value: 'getInfo',
                        description: 'This method returns an array of PCI devices.',
                    },
                ],
            });

            // getInfo()
            if (selectedMethod === 'getInfo') {
                const pci = new SYSTEM.Pci();
                const devices = await pci.getDevices();

                console.log('');
                console.log('PCI devices:');
                console.log(devices);
                console.log('');
            }
        }

        /**
         * Select Wallpaper method
         */
        if (selectedModule === 'wallpaper') {
            const selectedMethod = await select({
                message: 'Select Wallpaper module',
                choices: [
                    {
                        name: 'getImage()',
                        value: 'getImage',
                        description: 'This method return current wallpaper.',
                    },
                ],
            });

            // getImage()
            if (selectedMethod === 'getImage') {
                const wallpaper = new SYSTEM.Wallpaper();
                const path = await wallpaper.getImage();

                console.log('');
                console.log('Current wallpaper:');
                console.log(path);
                console.log('');
            }
        }
    } catch {
        console.log('');
        console.log(error('🏁 The script unexpectedly closed'));
        console.log('');
    }
}