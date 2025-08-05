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
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({ locale, namespace: "meta.home" });
    return {
        title: t("title"),
        description: t("description"),
        keywords: t('keywords').split(',').map((kw) => kw.trim()),
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: "https://www.hawya-rental.com/",
            siteName: "Hawya",
            type: "website",
            images: [
                {
                    url: "https://www.hawya-rental.com/og/home.jpg",
                    width: 1200,
                    height: 630,
                    alt: t("ogAlt"),
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("twitterTitle"),
            description: t("twitterDescription"),
            images: ["https://www.hawya-rental.com/og/home.jpg"],
        },
        alternates: {
            canonical: "https://www.hawya-rental.com/",
            languages: {
                en: "https://www.hawya-rental.com/en",
                ar: "https://www.hawya-rental.com/ar",
            },
        },
    };
}

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
