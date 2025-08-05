import Contact from "@/components/home/contact/Contact";
import React from "react";

export const metadata = {
    title: "Contact Hawya – Car Rental Support & Booking Inquiries",
    description:
        "Get in touch with Hawya for car rental bookings, questions, or support. Contact us via form, phone, or visit our Dammam office in Saudi Arabia.",
    keywords: [
        "contact car rental Saudi Arabia",
        "car rental support Dammam",
        "Hawya contact",
        "book rental car Saudi",
        "car hire phone number Saudi Arabia",
        "car rental email address KSA",
        "visit Hawya office Dammam",
        "get in touch car rental",
    ],
    openGraph: {
        title: "Contact Hawya – Reach Our Car Rental Office in Saudi Arabia",
        description:
            "Send us a message, call our office, or visit our Dammam branch. Hawya is here to help with all your car rental needs across Saudi Arabia.",
        url: "https://www.hawya-rental.com/contact",
        siteName: "Hawya",
        type: "website",
        images: [
            {
                url: "https://www.hawya-rental.com/og/contact.jpg", // Replace with actual OG image
                width: 1200,
                height: 630,
                alt: "Customer contacting Hawya car rental office in Dammam, Saudi Arabia",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Hawya – Car Rental Inquiries & Support",
        description:
            "Reach out to Hawya via contact form, phone, or email. We're here to help with rentals, bookings, and customer support across Saudi Arabia.",
        images: ["https://www.hawya-rental.com/og/home.jpg"],
    },
    alternates: {
        canonical: "https://www.hawya-rental.com/contact",
        languages: {
            en: "https://www.hawya-rental.com/en/contact",
            ar: "https://www.hawya-rental.com/ar/contact",
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
            <Contact />
        </div>
    );
}
