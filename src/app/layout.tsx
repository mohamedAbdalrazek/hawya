import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/nav/Nav";
import Footer from "@/components/layout/footer/Footer";
import Head from "next/head";

const inter = Inter({
    variable: "--inter",
    subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: {
        default: "Hawya Car Rental | Reliable Car Hire in Saudi Arabia",
        template: "%s | Hawya Car Rental",
    },
    description:
        "Rent a car easily with Hawya — Saudi Arabia’s trusted car rental service. Choose from a wide range of reliable vehicles for daily, weekly, or monthly rentals.",
    keywords: [
        "car rental",
        "Saudi Arabia",
        "rent a car",
        "Hawya",
        "car hire",
        "vehicle rental",
        "cheap car rental",
        "SUV rental",
        "Riyadh car rental",
        "Jeddah car hire",
    ],
    openGraph: {
        title: "Hawya Car Rental | Reliable Car Hire in Saudi Arabia",
        description:
            "Explore our premium fleet of cars for rent. Book online and enjoy seamless, flexible car rental services across Saudi Arabia with Hawya.",
        url: "https://hawya.vercel.app",
        siteName: "Hawya Car Rental",
        images: [
            {
                url: "https://hawya.vercel.app/og-image.jpg", // Replace with your actual OG image
                width: 1200,
                height: 630,
                alt: "Hawya Car Rental – Trusted Car Hire in Saudi Arabia",
            },
        ],
        locale: "en_SA",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Hawya Car Rental",
        description:
            "Reliable car rental in Saudi Arabia. Browse, book, and drive with Hawya.",
        images: ["https://hawya.vercel.app/og-image.jpg"], // Replace with your actual image
    },
    metadataBase: new URL("https://hawya.vercel.app/"), // Replace with your domain
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Head>
                <meta name="apple-mobile-web-app-title" content="Hawya" />
            </Head>
            <body className={`${inter.variable} ${geistMono.variable}`}>
                <Nav />
                {children}
                <Footer />
            </body>
        </html>
    );
}
