"use client";
import React, { useMemo } from "react";
import styles from "./CarsFilter.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { carColors, carModels, carTypes, carYears } from "@/utils/info";

export default function CarsFilters() {
    const searchParams = useSearchParams();
    const params = useMemo(
        () => new URLSearchParams(searchParams),
        [searchParams]
    );
    const yearFilter = params.get("year");
    const typeFilter = params.get("type");
    const colorFilter = params.get("color");
    const modelFilter = params.get("model");
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleChange = (
        field: string,
        e?: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const params = new URLSearchParams(searchParams);
        if (e && e.target.value) {
            params.set(field, e.target.value);
        } else {
            params.delete(field);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const clearFilter = (field: string) => {
        const params = new URLSearchParams(searchParams);
        params.delete(field);
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className={`${styles.filterGrid}`}>
            <div className={styles.filterGroup}>
                <label htmlFor="model" className={styles.label}>
                    Car Model
                </label>
                <div className={styles.selectWrapper}>
                    <select
                        id="model"
                        onChange={(e) => handleChange("model", e)}
                        className={styles.select}
                        value={modelFilter ?? ""}
                    >
                        <option value="">Model</option>
                        {carModels.map((model) => (
                            <option key={model.value} value={model.value}>
                                {model.label}
                            </option>
                        ))}
                    </select>
                    {modelFilter && (
                        <button
                            className={styles.clearSelectButton}
                            onClick={() => clearFilter("model")}
                            type="button"
                            aria-label="Clear model filter"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
            <div className={styles.filterGroup}>
                <label htmlFor="type" className={styles.label}>
                    Car Type
                </label>
                <div className={styles.selectWrapper}>
                    <select
                        id="type"
                        onChange={(e) => handleChange("type", e)}
                        className={styles.select}
                        value={typeFilter ?? ""}
                    >
                        <option value="">Type</option>
                        {carTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {typeFilter && (
                        <button
                            className={styles.clearSelectButton}
                            onClick={() => clearFilter("type")}
                            type="button"
                            aria-label="Clear type filter"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
            <div className={styles.filterGroup}>
                <label htmlFor="year" className={styles.label}>
                    Car year
                </label>
                <div className={styles.selectWrapper}>
                    <select
                        id="year"
                        onChange={(e) => handleChange("year", e)}
                        className={styles.select}
                        value={yearFilter ?? ""}
                    >
                        <option value="">Year</option>
                        {carYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    {yearFilter && (
                        <button
                            className={styles.clearSelectButton}
                            onClick={() => clearFilter("year")}
                            type="button"
                            aria-label="Clear year filter"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="color" className={styles.label}>
                    Car Color
                </label>
                <div className={styles.selectWrapper}>
                    <select
                        id="color"
                        onChange={(e) => handleChange("color", e)}
                        className={styles.select}
                        value={colorFilter ?? ""}
                    >
                        <option value="">Color</option>
                        {carColors.map((color) => (
                            <option key={color.value} value={color.value}>
                                {color.label}
                            </option>
                        ))}
                    </select>
                    {colorFilter && (
                        <button
                            className={styles.clearSelectButton}
                            onClick={() => clearFilter("color")}
                            type="button"
                            aria-label="Clear color filter"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
