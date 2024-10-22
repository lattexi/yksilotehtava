export interface Menu {
    date: string;
    courses: Course[];
}


export interface Course {
    name: string;
    price: string;
    diets?: string;
}

export interface Restaurant {
    _id: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    company: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
}