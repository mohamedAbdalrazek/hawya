import React from "react";
import BookingForm from "./BookingClient";
export const metadata = {
    title: "Book a Car Rental in Saudi Arabia – Daily or Monthly | Hawya",
    description:
        "Reserve your rental car online with Hawya. Choose the model, year, and rental duration. Enjoy flexible daily or monthly plans and view available vehicles instantly.",
    keywords: [
        "book car rental Saudi Arabia",
        "rent a car online KSA",
        "daily car hire Saudi",
        "monthly car rental booking",
        "Hawya car booking",
        "car rental reservation Eastern Province",
        "rent a vehicle in Dammam",
        "car rental form Saudi",
        "flexible car booking KSA",
    ],
    openGraph: {
        title: "Book Your Car Rental with Hawya – Daily & Monthly Plans",
        description:
            "Complete your car rental reservation with Hawya. Choose your vehicle and rental plan. Fast, flexible, and available across Saudi Arabia.",
        url: "https://www.hawya-rental.com/car-rental",
        siteName: "Hawya",
        type: "website",
        images: [
            {
                url: "https://www.hawya-rental.com/og/cars.jpg", // Replace with real OG image showing booking or form
                width: 1200,
                height: 630,
                alt: "Booking a rental car online with Hawya in Saudi Arabia",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Book a Rental Car Online – Hawya Saudi Arabia",
        description:
            "Submit your car rental request with Hawya. Flexible daily and monthly plans available. Choose your car, duration, and book online now.",
        images: ["https://www.hawya-rental.com/og/cars.jpg"],
    },
    alternates: {
        canonical: "https://www.hawya-rental.com/car-rental",
        languages: {
            en: "https://www.hawya-rental.com/en/car-rental",
            ar: "https://www.hawya-rental.com/ar/car-rental",
        },
    },
    robots: {
        index: true,
        follow: true,
    },
};
export default function page() {
    return <BookingForm />;
}
