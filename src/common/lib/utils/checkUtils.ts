export const isObjectEmpty = <T extends object | undefined | null>(object: T) => {
    if (object === null || object === undefined) return true;
    return Object.keys(object).length === 0;
}