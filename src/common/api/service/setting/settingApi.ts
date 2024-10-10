import {useHttpClient, ApiResponse} from '@/common/api/httpClient';
import {apiConstants} from '@/common/api/apiConstants';
import {
    CellImgAnalyzedRequest,
    CellImgAnalyzedResponse,
} from '@/common/api/service/setting/dto/cellImgAnalyzedDto'
import { GramRangeRequest, GramRangeResponse } from "@/common/api/service/setting/dto/gramRangeDto";
import { CreateImagePrintDto, ImagePrintItem, UpdateImagePrintsDto } from "@/common/api/service/setting/dto/imagePrintDto";
import { CreateCbcCodeRbcDto, cbcCodeItem, UpdateCbcCodeRbcDto } from "@/common/api/service/setting/dto/lisCodeDto";
import {CreateFilePathDto, FilePathItem, UpdateFilePathsDto} from "@/common/api/service/setting/dto/filePathSetDto";

const httpClient = useHttpClient();

export const createCellImgApi = async (request: any): Promise<ApiResponse<CellImgAnalyzedRequest | undefined>> => {
    return httpClient.httpPost(apiConstants.settings.cellImgAnalyzedPost.cellImgAdd, request);
};

export const getCellImgApi = async (): Promise<ApiResponse<CellImgAnalyzedResponse | undefined>> => {
    return httpClient.httpGet(apiConstants.settings.cellImgAnalyzedPost.cellImgGet);
};

export const putCellImgApi = async (request: any): Promise<ApiResponse<CellImgAnalyzedResponse | undefined>> => {
    return httpClient.httpPut(apiConstants.settings.cellImgAnalyzedPost.cellImgPut, request);
};



export const createGramRangeApi = async (request: GramRangeRequest): Promise<ApiResponse<void>> => {
    return httpClient.httpPost(apiConstants.settings.gramRange.create, request);
};

export const updateGramRangeApi = async (request: GramRangeRequest): Promise<ApiResponse<GramRangeResponse | undefined>> => {
    return httpClient.httpPut(apiConstants.settings.gramRange.update, request);
};

export const getGramRangeApi = async (): Promise<ApiResponse<GramRangeResponse | undefined>> => {
    return httpClient.httpGet(apiConstants.settings.gramRange.get);
};

export const createImagePrintApi = async (request: CreateImagePrintDto): Promise<ApiResponse<void>> => {
    return httpClient.httpPost(apiConstants.settings.imagePrint.create, request);
};

export const updateImagePrintApi = async (request: UpdateImagePrintsDto): Promise<ApiResponse<UpdateImagePrintsDto | undefined>> => {
    return httpClient.httpPut(apiConstants.settings.imagePrint.update, request);
};

export const getImagePrintApi = async (): Promise<ApiResponse<ImagePrintItem[] | undefined>> => {
    return httpClient.httpGet(apiConstants.settings.imagePrint.get);
};

// cbc code
export const createCbcCodeRbcApi = async (request: CreateCbcCodeRbcDto): Promise<ApiResponse<void>> => {
    return httpClient.httpPost(apiConstants.settings.cbcCode.create, request);
};

export const updateCbcCodeRbcApi = async (request: UpdateCbcCodeRbcDto): Promise<ApiResponse<UpdateCbcCodeRbcDto | undefined>> => {
    return httpClient.httpPut(apiConstants.settings.cbcCode.update, request);
};

export const getCbcCodeRbcApi = async (): Promise<ApiResponse<cbcCodeItem[] | undefined>> => {
    return httpClient.httpGet(apiConstants.settings.cbcCode.get);
};

// file path set
export const createFilePathSetApi = async (request: CreateFilePathDto): Promise<ApiResponse<void>> => {
    return httpClient.httpPost(apiConstants.settings.filePathSet.create, request);
};

export const updateFilePathSetApi = async (request: UpdateFilePathsDto): Promise<ApiResponse<UpdateFilePathsDto | undefined>> => {
    return httpClient.httpPut(apiConstants.settings.filePathSet.update, request);
};

export const getFilePathSetApi = async (): Promise<ApiResponse<FilePathItem[] | undefined>> => {
    return httpClient.httpGet(apiConstants.settings.filePathSet.get);
};

// --- 드라이브
export const getDrivesApi = async (): Promise<ApiResponse<any | undefined>> => {
    return httpClient.httpGet(apiConstants.settings.folder.get);
};

// remaining Count
export const remainingCount = async (): Promise<ApiResponse<any>> => {
    return httpClient.httpGet(apiConstants.settings.remainingCount.get);
};

export const qualityCheck = async (): Promise<ApiResponse<any>> => {
    return httpClient.httpGet(apiConstants.settings.qualityCheck.get);
};