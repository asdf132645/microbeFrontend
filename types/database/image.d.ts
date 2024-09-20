export interface ImageSourceType {
    type: string;
    buildPyramid: boolean;
    width: number;
    height: number;
    url: string;
}

export type DirectionType = 'left' | 'right';

export type BeforeAfterStatusType = 'before' | 'after';