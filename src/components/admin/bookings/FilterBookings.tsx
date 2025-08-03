"use client";

import React from "react";
import styles from "./FilterBookings.module.css";
import { carModels } from "@/utils/info";
import { FaCalendar } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function FilterBookings({
    handleChangeFilters,
    filters,
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

    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterGrid}>
                <div className={styles.filterGroup}>
                    <label htmlFor="phone" className={styles.label}>
                        {t("BookingsPage.FilterBookings.phoneLabel")}
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        value={filters.phone}
                        placeholder={t("BookingsPage.FilterBookings.phonePlaceholder")}
                        onChange={(e) => {
                            handleChangeFilters("phone", e.target.value);
                        }}
                        className={styles.input}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="name" className={styles.label}>
                        {t("BookingsPage.FilterBookings.nameLabel")}
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={filters.name}
                        placeholder={t("BookingsPage.FilterBookings.namePlaceholder")}
                        onChange={(e) => {
                            handleChangeFilters("name", e.target.value);
                        }}
                        className={styles.input}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="model" className={styles.label}>
                        {t("BookingsPage.FilterBookings.modelLabel")}
                    </label>
                    <select
                        id="model"
                        onChange={(e) => {
                            handleChangeFilters("model", e.target.value);
                        }}
                        className={styles.select}
                        value={filters.model}
                    >
                        <option value="">{t("BookingsPage.FilterBookings.allModels")}</option>
                        {carModels.map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="date" className={styles.label}>
                        {t("BookingsPage.FilterBookings.dateLabel")}
                    </label>
                    <div className={styles.datePickerContainer}>
                        <div className={styles.datePickerWrapper}>
                            <div className={styles.calendarIcon}>
                                <FaCalendar />
                            </div>
                            <input
                                id="date"
                                type="date"
                                onChange={(e) => {
                                    handleChangeFilters("date", e.target.value);
                                }}
                                value={filters.date}
                                className={styles.dateInput}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
