import { ExecOptions, SpawnSyncOptionsWithStringEncoding  } from 'child_process';

export const POWERSHELL_ARGS_EXEC: ExecOptions = {
    windowsHide: true,
    maxBuffer: 1024 * 20000,
    env: { ...process.env, LANG: 'en_US.UTF-8' },
};

export const POWERSHELL_ARGS_SPAWN: SpawnSyncOptionsWithStringEncoding = {
    stdio: 'pipe',
    windowsHide: true,
    maxBuffer: 1024 * 20000,
    encoding: 'utf8',
    env: { ...process.env, LANG: 'en_US.UTF-8' },
};