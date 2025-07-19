export interface CarMap {
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
export interface BookingFormData  {
    name: string;
    phone: string;
    idNumber: string;
    birthDate: string;
    rentalType: "daily" | "monthly";
    color: string;
    startDate: string;
    period: number;
    model: string;
    year: string;
};