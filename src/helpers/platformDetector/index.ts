import { isLinux, isMac, isWindows } from '../os';

export interface IPlatformDetectorParams<T> {
    linux: T;
    macos: T;
    windows: T;
}

/**
 * @param {IPlatformDetectorParams} params
 * @returns {T | null}
 */
export const plafromDetector = <T>(params: IPlatformDetectorParams<T>): T | null => {
    if (isLinux) {
        return params.linux;
    }

    if (isMac) {
        return params.macos;
    }

    if (isWindows) {
        return params.windows;
    }

    return null;
};
