// components/LanguageSwitcher/LanguageSwitcher.tsx
"use client";

import React, { useState } from "react";
import styles from "./LanguageSwitcher.module.css";
import Image from "next/image";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useRouter } from "next/navigation";


export default function LanguageSwitcher({className}:{className?:string}) {
    const locale = useLocale()
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    const changeLanguage = (lang: string) => {
        closeDropdown();
        router.push(`/${lang}${pathname}`);
    };

    const languages = [
        { code: "en", name: "English", flag: "/flags/uk.png" },
        { code: "ar", name: "العربية", flag: "/flags/sa.png" },
    ];

    const currentLangData = languages.find(
        (lang) => lang.code === locale
    );

    return (
        <div className={`${styles.languageSwitcher} ${className}`}>
            <button
                className={styles.switcherButton}
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Language selector"
            >
                {currentLangData && (
                    <>
                        <Image
                            src={currentLangData.flag}
                            alt={`${currentLangData.name} flag`}
                            width={24}
                            height={18}
                            className={styles.flag}
                        />
                        <span className={styles.languageName}>
                            {currentLangData.name}
                        </span>
                        <span className={styles.chevron}>
                            {isOpen ? "↑" : "↓"}
                        </span>
                    </>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            className={`${styles.languageOption} ${
                                locale === language.code
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() =>
                                changeLanguage(language.code)
                            }
                            aria-label={`Switch to ${language.name}`}
                        >
                            <Image
                                src={language.flag}
                                alt={`${language.name} flag`}
                                width={24}
                                height={18}
                                className={styles.flag}
                            />
                            <span className={styles.languageName}>
                                {language.name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
