import { Geist_Mono, Inter } from "next/font/google";

const inter = Inter({
    variable: "--inter",
    subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

import "./globals.css";
import Nav from "@/components/layout/nav/Nav";
import Footer from "@/components/layout/footer/Footer";
import Head from "next/head";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";

export const metadata = {
    title: "Hawya | Premium Car Rentals Across Saudi Arabia",
    description:
        "Explore Hawya’s reliable, modern fleet available across Dammam, Khobar, Dhahran, and Jubail. Enjoy flexible rentals, full insurance, and 24/7 bilingual support.",
    keywords: [
        "car rental Saudi Arabia",
        "rent a car Dammam",
        "car hire Khobar",
        "monthly car rental Saudi",
        "luxury car rental KSA",
        "cheap car rental Jubail",
        "SUV rental Dhahran",
        "Hawya car rentals",
        "rent a car Eastern Province",
    ],
    openGraph: {
        title: "Hawya | Reliable Car Rentals Across Saudi Arabia",
        description:
            "Premium vehicles, flexible rentals, and 24/7 support across Saudi cities like Dammam and Khobar. Book with Hawya today.",
        url: "https://www.hawya-rental.com/",
        siteName: "Hawya",
        type: "website",
        images: [
            {
                url: "https://www.hawya-rental.com/og/home.jpg", // Replace with your actual OG image path
                width: 1200,
                height: 630,
                alt: "Luxury car rental by Hawya in Saudi Arabia",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Hawya – Premium Car Rentals in Saudi Arabia",
        description:
            "Rent a premium car with confidence anywhere in Saudi Arabia. Available in Dammam, Khobar, Jubail, and more.",
        images: ["https://www.hawya-rental.com/og/home.jpg"],
    },
    alternates: {
        canonical: "https://www.hawya-rental.com/",
        languages: {
            en: "https://www.hawya-rental.com/en",
            ar: "https://www.hawya-rental.com/ar", // if Arabic version exists
        },
    },
};

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    return (
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
            <Head>
                <meta name="apple-mobile-web-app-title" content="Hawya" />
            </Head>
            <body className={`${inter.variable} ${geistMono.variable}`}>
                <NextIntlClientProvider>
                    <Nav />
                    {children}
                    <Footer />
                    <Toaster position="top-right" reverseOrder={false} />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
