import Locations from "@/components/home/locations/Locations";
import React from "react";
export const metadata = {
    title: "Hawya Branch Locations – Rent a Car in Dammam, Khobar, Jubail & Dhahran",
    description:
        "Find Hawya car rental branches across the Eastern Province of Saudi Arabia. Visit our locations in Dammam, Khobar, Dhahran, and Jubail to rent a car easily.",
    keywords: [
        "car rental locations Saudi Arabia",
        "car hire Dammam",
        "car rental Khobar",
        "rent a car Jubail",
        "Dhahran car hire",
        "Hawya branches Eastern Province",
        "Saudi car rental offices",
        "where to rent a car in Saudi Arabia",
    ],
    openGraph: {
        title: "Hawya Locations – Car Rental Across Eastern Province Cities",
        description:
            "Hawya offers reliable car rental services in Dammam, Khobar, Jubail, and Dhahran. Get directions, view business hours, and contact us today.",
        url: "https://www.hawya-rental.com/locations",
        siteName: "Hawya",
        type: "website",
        images: [
            {
                url: "https://www.hawya-rental.com/og/home.jpg", // Replace with your actual OG image
                width: 1200,
                height: 630,
                alt: "Map showing Hawya rental locations in Eastern Province Saudi Arabia",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Hawya Car Rental Branches in Saudi Arabia – View All Locations",
        description:
            "Find and visit Hawya branches in Dammam, Khobar, Jubail, and Dhahran. View maps, hours, and contact details for car rental across Saudi Arabia.",
        images: ["https://www.hawya-rental.com/og/home.jpg"],
    },
    alternates: {
        canonical: "https://www.hawya-rental.com/locations",
        languages: {
            en: "https://www.hawya-rental.com/en/locations",
            ar: "https://www.hawya-rental.com/ar/locations",
        },
    },
    robots: {
        index: true,
        follow: true,
    },
};
export default function page() {
    return (
        <div style={{ paddingTop: "80px" }}>
            <Locations />
        </div>
    );
}
