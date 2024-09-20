import { spawnSync } from 'child_process';
import { promises as fs } from 'fs';

import { POWERSHELL_ARGS_SPAWN } from '@src/helpers/terminalParams/windows';

import { ISpciWallpaper } from '../interface';

class Windows implements ISpciWallpaper {
    private CMD: string =
        "(Get-ItemProperty -Path 'HKCU:\\Control Panel\\Desktop' -Name WallPaper).WallPaper | Out-String";

    /**
     * @returns {Promise<string>}
     */
    private async getDataFromTerminal(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const responce = spawnSync('powershell.exe', ['-Command', this.CMD], { ...POWERSHELL_ARGS_SPAWN });

                if (responce.error) {
                    console.error('Error while getting data from terminal:', responce.error.message);
                    reject(responce.error);
                }

                if (responce.status !== 0) {
                    console.error('Error while get data from terminal. Code:', responce.status);
                    reject(responce.stderr);
                }

                resolve(responce.stdout.trim());
            } catch (error) {
                reject(error);
            }
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
