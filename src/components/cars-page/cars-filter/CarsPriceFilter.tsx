"use client";
import React, { useEffect, useState } from "react";
import styles from "./CarsPriceFilter.module.css";
import { Slider } from "@mui/material";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

function valuetext(value: number) {
    return `${value}°C`;
}

interface CarsPriceFilterProps {
    isExpanded: boolean;
    onAnimationEnd: () => void;
}

export default function CarsPriceFilter({
    isExpanded,
    onAnimationEnd,
}: CarsPriceFilterProps) {
    const searchParams = useSearchParams();

    const pathname = usePathname();
    const { replace } = useRouter();

    const [monthlyMinMax, setMonthlyMinMax] = useState<number[]>([]);
    const [dailyMinMax, setDailyMinMax] = useState<number[]>([]);
    const [dailyRange, setDailyRange] = useState<number[]>([]);
    const [monthlyRange, setMonthlyRange] = useState<number[]>([]);
    const t = useTranslations("CarsFilters");

    const dailyMarks = [
        { value: dailyRange[0], label: `${dailyRange[0]} ${t("currency")}` },
        { value: dailyRange[1], label: `${dailyRange[1]} ${t("currency")}` },
    ];

    const monthlyMarks = [
        {
            value: monthlyRange[0],
            label: `${monthlyRange[0]} ${t("currency")}`,
        },
        {
            value: monthlyRange[1],
            label: `${monthlyRange[1]} ${t("currency")}`,
        },
    ];

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams);
        if (dailyRange[0] && dailyRange[1]) {
            params.set("minDailyPrice", dailyRange[0].toString());
            params.set("maxDailyPrice", dailyRange[1].toString());
        } else {
            params.delete("minDailyPrice");
            params.delete("maxDailyPrice");
        }
        if (monthlyRange[0] || monthlyRange[1]) {
            params.set("minMonthlyPrice", monthlyRange[0].toString());
            params.set("maxMonthlyPrice", monthlyRange[1].toString());
        } else {
            params.delete("minMonthlyPrice");
            params.delete("maxMonthlyPrice");
        }

        replace(`${pathname}?${params.toString()}`);
    };

    const clearFilter = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("minDailyPrice");
        params.delete("maxDailyPrice");
        params.delete("minMonthlyPrice");
        params.delete("maxMonthlyPrice");
        replace(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await fetch(`/api/getMaxMinPrice`);
                if (response.ok) {
                    const data = await response.json();
                    setDailyMinMax(data.dailyRange);
                    setMonthlyMinMax(data.monthlyRange);
                    setDailyRange(data.dailyRange);
                    setMonthlyRange(data.monthlyRange);
                } else {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchPrices();
    }, []);

    return (
        <div
            id="price-filter-content"
            className={`${styles.filterContent} ${
                isExpanded ? styles.expanded : styles.collapsed
            }`}
            onAnimationEnd={onAnimationEnd}
            aria-hidden={!isExpanded}
        >
            <div className={styles.priceFilterGroup}>
                <label className={styles.label}>{t("dailyPriceLabel")}</label>
                <div className={styles.sliderWrapper}>
                    <Slider
                        getAriaLabel={() => "Daily price range"}
                        value={dailyRange}
                        onChange={(_, newValue) =>
                            setDailyRange(newValue as number[])
                        }
                        marks={dailyMarks}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        max={dailyMinMax[1] || 10000}
                        min={dailyMinMax[0] || 0}
                        step={20}
                        className={styles.priceSlider}
                    />
                </div>
            </div>

            <div className={styles.priceFilterGroup}>
                <label className={styles.label}>{t("monthlyPriceLabel")}</label>
                <div className={styles.sliderWrapper}>
                    <Slider
                        getAriaLabel={() => "Monthly price range"}
                        value={monthlyRange}
                        onChange={(_, newValue) =>
                            setMonthlyRange(newValue as number[])
                        }
                        marks={monthlyMarks}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        max={monthlyMinMax[1] || 10000}
                        min={monthlyMinMax[0] || 0}
                        step={300}
                        className={styles.priceSlider}
                    />
                </div>
            </div>
            <div className={styles.buttonsWrapper}>
                <button
                    className={styles.filterButton}
                    onClick={handleFilter}
                    aria-label={t("applyFilters")}
                >
                    {t("applyFilters")}
                </button>
                <span className={styles.clearFilters} onClick={clearFilter}>Clear</span>
            </div>
        </div>
    );
}
