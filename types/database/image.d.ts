export interface ImageSourceType {
    type: string;
    buildPyramid: boolean;
    width: number;
    height: number;
    url: string;
    imageName: string;
}

export type DirectionType = 'left' | 'right';