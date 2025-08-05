"use client";

import { ClientCarMap } from "@/utils/types";
import React from "react";

interface CarStructuredDataProps {
    car: ClientCarMap;
    url: string; // booking or detail page
    currency?: string;
}

export default function CarStructuredData({
    car,
    url,
    currency = "SAR",
}: CarStructuredDataProps) {
    const imageUrl = Array.isArray(car.images) ? car.images[0] : "/cars/placeholder.jpg"; // fallback logic
    const name = `${car.model} ${car.year}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        image: imageUrl,
        description: `Rent a ${car.year} ${car.model} (${car.type}, ${
            car.transmission
        }) with daily or monthly pricing. Available colors: ${car.availableColors.join(
            ", "
        )}`,
        brand: {
            "@type": "Brand",
            name: car.model,
        },
        sku: car.id,
        offers: [
            {
                "@type": "Offer",
                priceCurrency: currency,
                price: car.priceDay.toString(),
                priceValidUntil: "2026-01-01",
                itemCondition: "https://schema.org/UsedCondition",
                availability: "https://schema.org/InStock",
                url,
                seller: {
                    "@type": "Organization",
                    name: "Hawya",
                },
            },
            {
                "@type": "Offer",
                priceCurrency: currency,
                price: car.priceMonth.toString(),
                priceValidUntil: "2026-01-01",
                itemCondition: "https://schema.org/UsedCondition",
                availability: "https://schema.org/InStock",
                url,
                seller: {
                    "@type": "Organization",
                    name: "Hawya",
                },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
