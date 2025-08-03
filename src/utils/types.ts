
export interface ClientCarMap {
    model: string;
    year: number;
    type: string;
    availableColors: string[];
    transmission: string;
    priceDay: number;
    priceMonth: number;
    images: ClientImageMap;
    id: string
}
export interface PostCarMap {
    model: string;
    year: number;
    type: string;
    availableColors: string[];
    transmission: string;
    priceDay: number;
    priceMonth: number;
    images: ImagesMap;
}
export interface CarMap extends PostCarMap {
    id: string;
}
export interface NewCarMap {
    model: string;
    id: string;
    year: number;
    type: string;
    availableColors: string[];
    transmission: string;
    priceDay: number;
    priceMonth: number;
    images: NewImagesMap;
}
export interface NewImagesMap {
    [key: string]: File[]
}
export interface ImagesMap {
    [key: string]: {
        imageUrl: string;
        imageId?: string
    }[]
}
export interface ClientImageMap {
    [key: string]: string[]
}
export interface BookingFormData {
    name: string;
    phone: string;
    idNumber: string;
    birthDate: string;
    id: string;
    rentalType: "daily" | "monthly";
    color: string;
    startDate: string;
    carId: string;
    period: number;
    model: string;
    year: string;
};
export interface StaffMap {
    name: string;
    role: "admin" | "staff",
    email: string;
    id: string;
}



export interface MessageMap {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

export interface MessageAdminMap extends MessageMap {

    id: string;
    createTime: Date;
};