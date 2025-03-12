import {GRADE_TEXT} from "@/common/defines/constFile/dataBase";

export function parseXMLToJSON(xml: any): any {
    let obj: any = {};

    if (xml.nodeType === 1) { // element
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                if (attribute) {
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue;
    }

    // 자식 노드들을 반복하면서 JSON으로 변환
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;

            if (typeof obj[nodeName] === "undefined") {
                obj[nodeName] = parseXMLToJSON(item);
            } else {
                if (typeof obj[nodeName].push === "undefined") {
                    const old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(parseXMLToJSON(item));
            }
        }
    }

    return obj;
}

export const getSputumGrade = (wbcCount: number, epCellCount: number) => {
    const epCellWbcRatio = (epCellCount / wbcCount);
    if (epCellCount > 25 && wbcCount < 10) return GRADE_TEXT["1"];
    if (epCellCount > 25 && (10 <= wbcCount && wbcCount <= 25)) return GRADE_TEXT['2'];
    if (epCellCount > 25 && wbcCount > 25 && epCellWbcRatio < 10) return GRADE_TEXT['3-1'];
    if (epCellCount > 25 && wbcCount > 25 && epCellWbcRatio >= 10) return GRADE_TEXT['3-2'];
    if ((10 <= epCellCount && epCellCount >= 25) && wbcCount > 25 && epCellWbcRatio < 10) return GRADE_TEXT['4-1'];
    if ((10 <= epCellCount && epCellCount >= 25) && wbcCount > 25 && epCellWbcRatio >= 10) return GRADE_TEXT['4-2'];
    if (epCellCount < 10 && wbcCount > 25) return GRADE_TEXT['5'];
    if (epCellCount < 10 && wbcCount < 10) return GRADE_TEXT['6'];

    return GRADE_TEXT['2'];
}

export const getGradeByRange = (settingObj: any, count: number) => {
    if (count === 0) return '';
    if (count <= Number(settingObj.rareBoundary)) return GRADE_TEXT.RARE;
    if (count <= Number(settingObj.fewBoundary)) return GRADE_TEXT.FEW;
    if (count <= Number(settingObj.moderateBoundary)) return GRADE_TEXT.MODERATE;
    if (count > Number(settingObj.moderateBoundary)) return GRADE_TEXT.MANY;
    return '';
}

export const existOrNone = (count: number) => count > 0 ? GRADE_TEXT.EXIST : GRADE_TEXT.NONE;