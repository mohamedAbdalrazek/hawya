// src/components/Footer/Footer.tsx
"use client";
import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
} from "react-icons/fa";
import { useLocations, useNavLinks } from "@/utils/info";
import { useLocale, useTranslations } from "next-intl";

const Footer = () => {
    const navLinks = useNavLinks();
    const locations = useLocations();
    const t = useTranslations();

    const locale = useLocale();
    return (
        <footer
            className={`${styles.footer}  ${
                locale === "ar" && styles.arFooter
            }`}
        >
            <div className={`${styles.container} container`}>
                {/* Top Section */}
                <div className={styles.topSection}>
                    <div className={styles.brandInfo}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/logo-white.png"
                                alt={t("Footer.branding.alt")}
                                width={80}
                                height={80}
                            />
                            <span className={styles.logoText}>
                                {t("Footer.branding.name")}
                            </span>
                        </Link>
                        <p className={styles.tagline}>
                            {t("Footer.branding.tagline")}
                        </p>

                        <div className={styles.socialLinks}>
                            <a href="#" aria-label="Facebook">
                                <FaFacebook className={styles.socialIcon} />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <FaTwitter className={styles.socialIcon} />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <FaInstagram className={styles.socialIcon} />
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <FaLinkedin className={styles.socialIcon} />
                            </a>
                        </div>
                    </div>

                    <div className={`${styles.contactInfo}`}>
                        <h3 className={styles.sectionTitle}>
                            {t("Contact.heading")}
                        </h3>
                        <ul className={styles.contactList}>
                            <li>
                                <FaPhone className={styles.contactIcon} />
                                <a href="tel:+966561741202">+966 56 174 1202</a>
                            </li>
                            <li>
                                <FaEnvelope className={styles.contactIcon} />
                                <a href="mailto:info@hawyarental.com">
                                    info@hawyarental.com
                                </a>
                            </li>
                            <li>
                                <FaMapMarkerAlt
                                    className={styles.contactIcon}
                                />
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: t("Contact.info.address"),
                                    }}
                                />
                            </li>
                            <li>
                                <FaClock className={styles.contactIcon} />
                                <div>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: t("Contact.info.hours"),
                                        }}
                                    />
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.locations}>
                        <h3 className={styles.sectionTitle}>
                            {t("Footer.ourLocations")}
                        </h3>
                        <div className={styles.locationGrid}>
                            {locations.map((location, index) => (
                                <div
                                    key={index}
                                    className={styles.locationCard}
                                >
                                    <h4 className={styles.locationCity}>
                                        {location.city}
                                    </h4>
                                    <p className={styles.locationAddress}>
                                        {location.address}
                                    </p>
                                    <a
                                        href={`tel:${location.phone}`}
                                        className={styles.locationPhone}
                                    >
                                        {location.phone}
                                    </a>
                                    <p className={styles.locationHours}>
                                        {location.hours}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    <nav className={styles.footerNav}>
                        <ul className={styles.footerNavList}>
                            {navLinks.map((link) => (
                                <li
                                    key={link.path}
                                    className={styles.footerNavItem}
                                >
                                    <Link
                                        href={link.path}
                                        className={styles.footerNavLink}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.legal}>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: t("Footer.copyright", {
                                    year: new Date().getFullYear(),
                                }),
                            }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
