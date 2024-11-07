export const isObjectEmpty = <T extends object | undefined | null>(object: T) => {
    if (object === null || object === undefined) return true;
    return Object.keys(object).length === 0;
}

export const filterImageFiles = (files: string[]) => {
    const regex = /^\d*\.(jpg|bmp|jpeg)$/i;
    return files.filter((item: string) => regex.test(item));
};

export const filterAvailableImageItems = (files: string[]) => {
    const fileNameSet = new Set(files);
    const validImageFileNames = new Set();

    for (const fileName of files) {
        const baseName = fileName.split('.')[0];

        // 조건에 맞는 파일들이 모두 존재하는지 확인
        if (
            fileNameSet.has(`${baseName}.dzi`) &&
            fileNameSet.has(`${baseName}.jpg`) &&
            fileNameSet.has(`${baseName}.json`) &&
            fileNameSet.has(`${baseName}_files`)
        ) {
            // 모든 조건에 맞으면 해당 파일들을 추가
            validImageFileNames.add(`${baseName}.jpg`);
            validImageFileNames.add(`${baseName}_files`);
        }
    }

    return Array.from(validImageFileNames);
};