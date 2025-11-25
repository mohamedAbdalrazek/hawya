"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CarsGrid.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClientCarMap } from "@/utils/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import CarsSkeletonLoading from "@/components/global/skeleton-loading/CarsSkeletonLoading";
import { useTranslations } from "next-intl";
import CarCard from "../CarCard/CarCard";
import NoCarsFound from "@/components/global/no-car-found/NoCarsFound";
import CarStructuredData from "../car-structured-data/CarStructuredData";

export default function CarsGrid() {
    const t = useTranslations();

    const hasMounted = useRef(false);
    const prevFilterKey = useRef("");

    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState<ClientCarMap[]>([]);
    const [offset, setOffset] = useState(0);
    const limit = 6;
    const [hasMore, setHasMore] = useState(true);
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const yearFilter = params.get("year");
    const typeFilter = params.get("type");
    const modelFilter = params.get("model");
    const dailyRangeFilter = `${params.get("minDailyPrice")}-${params.get(
        "maxDailyPrice"
    )}`;
    const monthlyRangeFilter = `${params.get("minMonthlyPrice")}-${params.get(
        "maxMonthlyPrice"
    )}`;

    const filters = useMemo(
        () => [
            { field: "year", value: yearFilter },
            { field: "type", value: typeFilter },
            { field: "model", value: modelFilter },
            { field: "dailyPriceRange", value: dailyRangeFilter },
            { field: "monthlyPriceRange", value: monthlyRangeFilter },
        ],
        [
            yearFilter,
            typeFilter,
            modelFilter,
            dailyRangeFilter,
            monthlyRangeFilter,
        ]
    );
    const filterKey = useMemo(() => {
        return filters
            .filter((f) => f.value)
            .map((f) => `${f.field}:${f.value}`)
            .sort()
            .join("|");
    }, [filters]);
    const handleLoadMore = () => {
        if (hasMore && !loading) {
            const nextOffset = offset + limit;
            setOffset(nextOffset);
            fetchCars(filters, nextOffset, limit);
        }
    };
    const fetchCars = async (
        filters: { field: string; value: string | null }[] | null,
        offset: number,
        limit: number
    ) => {
        try {
            setLoading(true);
            let callParams = `?offset=${offset}&limit=${limit}`;
            filters?.forEach((filter) => {
                if (filter.value) {
                    callParams += `&${filter.field}=${filter.value}`;
                }
            });
            const response = await fetch(`/api/getCars${callParams}`);
            if (response.ok) {
                const data = await response.json();
                setCars((prev) => [...prev, ...data.cars]);
                if (offset + limit >= data.total) {
                    setHasMore(false);
                }
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const clearFilters = () => {
        replace(pathname);
    };
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            prevFilterKey.current = filterKey;
        } else if (prevFilterKey.current === filterKey) {
            return; // no change
        }

        prevFilterKey.current = filterKey;

        setCars([]);
        setOffset(0);
        setHasMore(true);
        fetchCars(filters, 0, limit);
    }, [filterKey, filters]);

    if (loading && cars.length === 0) return <CarsSkeletonLoading number={6} />;
    if (cars.length === 0 && !loading) {
        return <NoCarsFound isButton={true} clearFilters={clearFilters} />;
    }

    return (
        <section className={styles.fleetSection}>
            <div className={`${styles.container} container`}>
                <div className={styles.filterBar}>
                    <div className={styles.resultsCount}>
                        {t("CarsSection.resultsCount", { count: cars.length })}
                    </div>
                </div>

                <InfiniteScroll
                    dataLength={cars.length}
                    next={handleLoadMore}
                    hasMore={hasMore}
                    loader={<SpinLoader size="sm" />}
                    className={styles.infiniteScroll}
                >
                    <div className={styles.grid}>
                        {cars.map((car) => (
                            <React.Fragment key={car.id}>
                                <CarCard car={car} />
                                <CarStructuredData
                                    car={car}
                                    url="https://www.marakeb.co/car-rental"
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </section>
    );
}
