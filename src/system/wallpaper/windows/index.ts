import { promises as fs } from 'fs';

import shelljs from 'shelljs';

import { ISpciWallpaper } from '../interface';

class Windows implements ISpciWallpaper {
    private CMD: string =
        "(Get-ItemProperty -Path 'HKCU:\\Control Panel\\Desktop' -Name WallPaper).WallPaper | Out-String";

    /**
     * @returns {Promise<string>}
     */
    private async getDataFromTerminal(): Promise<string> {
        return new Promise((resolve, reject) => {
            const responce = shelljs.exec(`powershell.exe -Command "${this.CMD}"`, {
                async: false,
                silent: true,
                encoding: 'utf8',
            });

            if (responce.code !== 0) {
                console.error('Error while get data from terminal. Code:', responce.code);
                reject(responce.stderr);
            }

            resolve(responce.stdout.trim());
        });
    }

    /**
     * Get current wallpaper
     * @returns {Promise<string | null>}
     */
    public async getImage(): Promise<string | null> {
        const result = await this.getDataFromTerminal();
        const formattedPath = result.replace(/\\/g, '/');

        const data = await fs.readFile(formattedPath);
        const img = Buffer.from(data).toString('base64');
        return img;
    }
}

export default Windows;
