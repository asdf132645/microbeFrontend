export const isObjectEmpty = <T extends object | undefined | null>(object: T) => {
    if (object === null || object === undefined) return true;
    return Object.keys(object).length === 0;
}

export const filterImageFiles = (files: string[]) => {
    const regex = /^\d*\.(jpg|bmp|jpeg)$/i;
    return files.filter((item: string) => regex.test(item));
};