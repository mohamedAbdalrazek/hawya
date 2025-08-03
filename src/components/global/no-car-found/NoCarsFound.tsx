import React from "react";
import styles from "./NoCarsFound.module.css";
import { useTranslations } from "next-intl";
export default function NoCarsFound({
    isButton = false,
    clearFilters,
    
}: {
    isButton?: boolean;
    clearFilters?: () => void;
}) {
    const t = useTranslations();

    return (
        <div className={styles.noResults} style={{backgroundColor: !isButton?"transparent":"auto"}}>
            <div className={styles.noResultsIcon}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
            </div>
            <h3 className={styles.noResultsTitle}>
                {t("CarsSection.noResultsTitle")}
            </h3>
            {isButton && <p className={styles.noResultsMessage}>
                {t("CarsSection.noResultsMessage")}
            </p>}
            {isButton && (
                <button
                    className={styles.noResultsButton}
                    onClick={clearFilters}
                >
                    {t("CarsSection.clearFilters")}
                </button>
            )}
        </div>
    );
}
