"use client";

import React from "react";
import styles from "./ActiveFilters.module.css";
import { FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";

export interface FilterMap {
    field: string;
    value: string | null;
    label?: string;
}

export default function ActiveFilters({
    filters,
    handleChangeFilters,
}: {
    handleChangeFilters: (key: string, value: string) => void;
    filters: {
        date: string;
        model: string;
        phone: string;
        name: string;
    };
}) {
    const t = useTranslations("Admin");

    const getFilterLabel = (field: string, value: string) => {
        switch (field) {
            case "phone":
                return `${t("BookingsPage.ActiveFilters.phone")}: ${value}`;
            case "date":
                return `${t("BookingsPage.ActiveFilters.date")}: ${value}`;
            case "model":
                return `${t("BookingsPage.ActiveFilters.model")}: ${value}`;
            case "name":
                return `${t("BookingsPage.ActiveFilters.name")}: ${value}`;
            default:
                return value;
        }
    };

    return (
        <div className={styles.activeFiltersContainer}>
            {Object.entries(filters).map(
                ([field, value]) =>
                    value && (
                        <div key={field} className={styles.filterPill}>
                            <span className={styles.filterValue}>
                                {getFilterLabel(field, value)}
                            </span>
                            <button
                                className={styles.removeFilterButton}
                                onClick={() => handleChangeFilters(field, "")}
                                aria-label={t("BookingsPage.ActiveFilters.remove", { field })}
                            >
                                <FaTimes size={12} />
                            </button>
                        </div>
                    )
            )}
        </div>
    );
}
