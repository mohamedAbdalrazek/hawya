export interface CarMap {
    brand: string,
    model: string;
    id: string;
    year: number;
    type: string;
    availableColors: string[];
    transmission: string;
    priceDay: number;
    priceMonth: number;
    images: ImagesMap;
}
export interface ImagesMap {
    [key: string]: string[]
}