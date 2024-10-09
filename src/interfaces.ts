interface Restaurant {
    _id: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    company: string;
    location: {
        coordinates: [number, number];
    };
}

interface Course {
    name: string;
    diets: string;
    price: number;
}

interface Menu {
    courses: Course[]
};

export type { Restaurant, Menu };