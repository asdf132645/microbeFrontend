import { CLASS_INFO_ID } from "@/common/defines/constFile/dataBase";
import type { ClassInfoType } from "@/common/api/service/runningInfo/runningInfo.dto";

export const reClassification = (classInfo: ClassInfoType[]) => {
    const firstClassIds = [
        CLASS_INFO_ID.WBC,
        CLASS_INFO_ID.EP_CELL,
        CLASS_INFO_ID.SPUTUM
    ];
    const secondClassIds = [
        CLASS_INFO_ID.GPC,
        CLASS_INFO_ID.GPB,
        CLASS_INFO_ID.GNC,
        CLASS_INFO_ID.GNB,
        CLASS_INFO_ID.GPC_CLUSTERS,
        CLASS_INFO_ID.GPC_PAIRS,
        CLASS_INFO_ID.GPC_CHAINS,
        CLASS_INFO_ID.GPB_SMALL,
        CLASS_INFO_ID.GPB_LARGE,
        CLASS_INFO_ID.GNDC,
        CLASS_INFO_ID.GNCB
    ];
    const thirdClassIds = [
        CLASS_INFO_ID.YEAST,
        CLASS_INFO_ID.HYPHAE
    ];

    const sortedClassInfo = classInfo.sort((a,b) => {
        const aPriority = getPriority(a.classId, firstClassIds, secondClassIds, thirdClassIds);
        const bPriority = getPriority(b.classId, firstClassIds, secondClassIds, thirdClassIds);

        return aPriority - bPriority;
    });

    const hasSputum = sortedClassInfo.find((item) => item.classId === CLASS_INFO_ID.SPUTUM);
    if (hasSputum) {
        return sortedClassInfo.filter((item) => item.classId !== CLASS_INFO_ID.WBC && item.classId !== CLASS_INFO_ID.EP_CELL);
    }

    return sortedClassInfo;
}

const getPriority = (classId: string, firstClassIds: string[], secondClassIds: string[], thirdClassIds: string[]) => {
    if (firstClassIds.includes(classId)) {
        return 1;
    } else if (secondClassIds.includes(classId)) {
        return 2;
    } else if (thirdClassIds.includes(classId)) {
        return 3;
    } else {
        return 4;
    }
}