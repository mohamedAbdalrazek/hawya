"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./CarsFilter.module.css";
import { useTranslations } from "next-intl";
import CarsPriceFilter from "./CarsPriceFilter";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { PiSlidersHorizontal } from "react-icons/pi";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function CarsFilters() {
    const t = useTranslations("CarsFilters");

    const searchParams = useSearchParams();
    const params = useMemo(
        () => new URLSearchParams(searchParams),
        [searchParams]
    );
    const yearFilter = params.get("year");
    const typeFilter = params.get("type");

    const modelFilter = params.get("model");
    const pathname = usePathname();
    const [carsMeta, setCarsMeta] = useState<{models:string[], years:string[], types:string[]}>()
    const [isPriceFilterExpanded, setIsPriceFilterExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const [isMobileGridExpanded, setIsMobileGridExpanded] = useState(false);
    const [isMobileGridAnimating, setIsMobileGridAnimating] = useState(false);

    const toggleMobileGridExpanded = () => {
        if (isMobileGridAnimating) return;
        setIsMobileGridAnimating(true);
        setIsPriceFilterExpanded(
            isMobileGridExpanded ? false : isPriceFilterExpanded
        );
        setIsAnimating(isMobileGridAnimating ? true : isAnimating);

        setIsMobileGridExpanded(!isMobileGridExpanded);
    };
    const togglePriceFilterExpanded = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setIsPriceFilterExpanded(!isPriceFilterExpanded);
    };

    const handleAnimationEnd = () => {
        setIsAnimating(false);
    };

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

    useEffect(() => {
        async function fetchCarData() {
            try {
                const res = await fetch("/api/cars-details/get"); // adjust route if needed

                if (!res.ok) {
                    throw new Error(
                        `Server responded with status ${res.status}`
                    );
                }

                const data = await res.json();
                setCarsMeta(data);
            } catch (err) {
                console.error(err || "Failed to fetch car data");
            }
        }

        fetchCarData();
    }, []);
    return (
        <div>
            <div className={styles.gridContainer}>
                <span
                    className={styles.mobileToggle}
                    onClick={toggleMobileGridExpanded}
                >
                    {isMobileGridExpanded
                        ? t("mobileHideGrid")
                        : t("mobileShowGrid")}{" "}
                    <PiSlidersHorizontal />
                </span>
                <div
                    className={`${styles.filterGrid} ${
                        isMobileGridExpanded
                            ? styles.expanded
                            : styles.collapsed
                    }`}
                    onAnimationEnd={() => setIsMobileGridAnimating(false)}
                >
                    <div className={styles.filterGroup}>
                        <label htmlFor="model" className={styles.label}>
                            {t("modelLabel")}
                        </label>
                        <div className={styles.selectWrapper}>
                            <select
                                id="model"
                                onChange={(e) => handleChange("model", e)}
                                className={styles.select}
                                value={modelFilter ?? ""}
                            >
                                <option value="">
                                    {t("modelPlaceholder")}
                                </option>
                                {carsMeta?.models.map((model) => (
                                    <option key={model} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </select>
                            {modelFilter && (
                                <button
                                    className={styles.clearSelectButton}
                                    onClick={() => clearFilter("model")}
                                    type="button"
                                    aria-label={t("clearModel")}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Type Filter */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="type" className={styles.label}>
                            {t("typeLabel")}
                        </label>
                        <div className={styles.selectWrapper}>
                            <select
                                id="type"
                                onChange={(e) => handleChange("type", e)}
                                className={styles.select}
                                value={typeFilter ?? ""}
                            >
                                <option value="">{t("typePlaceholder")}</option>
                                {carsMeta?.types.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {typeFilter && (
                                <button
                                    className={styles.clearSelectButton}
                                    onClick={() => clearFilter("type")}
                                    type="button"
                                    aria-label={t("clearType")}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Year Filter */}
                    <div className={styles.filterGroup}>
                        <label htmlFor="year" className={styles.label}>
                            {t("yearLabel")}
                        </label>
                        <div className={styles.selectWrapper}>
                            <select
                                id="year"
                                onChange={(e) => handleChange("year", e)}
                                className={styles.select}
                                value={yearFilter ?? ""}
                            >
                                <option value="">{t("yearPlaceholder")}</option>
                                {carsMeta?.years.map((year) => (
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
                                    aria-label={t("clearYear")}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className={styles.label}>{t("priceFilterTitle")}</p>

                        <button
                            className={styles.toggleButton}
                            onClick={togglePriceFilterExpanded}
                            aria-expanded={isPriceFilterExpanded}
                            aria-controls="price-filter-content"
                            aria-label={
                                isPriceFilterExpanded
                                    ? t("collapseFilters")
                                    : t("expandFilters")
                            }
                        >
                            <span>{t("priceFilterTitle")}</span>
                            {isPriceFilterExpanded ? (
                                <BsArrowUp />
                            ) : (
                                <BsArrowDown />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <CarsPriceFilter
                isExpanded={isPriceFilterExpanded}
                onAnimationEnd={handleAnimationEnd}
            />
        </div>
    );
}
