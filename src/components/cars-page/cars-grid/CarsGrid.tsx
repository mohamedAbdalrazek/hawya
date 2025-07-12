"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CarsGrid.module.css";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { CarMap } from "@/utils/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import CarImagesSlider from "@/components/home/fleet-preview/CarImagesSlider";
import Image from "next/image";
import CarsSkeletonLoading from "@/components/global/skeleton-loading/CarsSkeletonLoading";

export default function CarsGrid() {
    const hasMounted = useRef(false);
    const prevFilterKey = useRef("");

    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState<CarMap[]>([]);
    const [offset, setOffset] = useState(0);
    const limit = 6;
    const [hasMore, setHasMore] = useState(true);
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const yearFilter = params.get("year");
    const typeFilter = params.get("type");
    const colorFilter = params.get("color");
    const modelFilter = params.get("model");
    const filters = useMemo(
        () => [
            { field: "year", value: yearFilter },
            { field: "type", value: typeFilter },
            { field: "color", value: colorFilter },
            { field: "model", value: modelFilter },
        ],
        [yearFilter, typeFilter, colorFilter, modelFilter]
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
            console.log("test");
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
        return (
            <div className={styles.noResults}>
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
                <h3 className={styles.noResultsTitle}>No Cars Found</h3>
                <p className={styles.noResultsMessage}>
                    We couldn&apos;t find any vehicles matching your filters.
                </p>
                <button
                    className={styles.noResultsButton}
                    onClick={clearFilters}
                >
                    Clear All Filters
                </button>
            </div>
        );
    }
    return (
        <section className={styles.fleetSection}>
            <div className={`${styles.container} container`}>
                <div className={styles.filterBar}>
                    {/* You can add filter controls here later */}
                    <div className={styles.resultsCount}>
                        Showing {cars.length} vehicles
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
                            <div key={car.id} className={styles.card}>
                                {car.images.length ? (
                                    <CarImagesSlider images={car.images} />
                                ) : (
                                    <div className={styles.imageContainer}>
                                        <Image
                                            src={"/cars/placeholder.jpg"}
                                            alt={car.model}
                                            // fill
                                            width={500}
                                            height={400}
                                            className={styles.image}
                                        />
                                    </div>
                                )}

                                <div className={styles.priceTag}>
                                    <span className={styles.price}>
                                        SAR {car.priceDay} / day
                                    </span>
                                    <span className={styles.priceLabel}></span>
                                    <span className={styles.monthlyPrice}>
                                        SAR {car.priceMonth} / month
                                    </span>
                                </div>

                                <div className={styles.content}>
                                    <div className={styles.modelHeader}>
                                        <h3 className={styles.model}>
                                            {car.model}
                                        </h3>
                                        <span className={styles.year}>
                                            {car.year}
                                        </span>
                                    </div>

                                    <div className={styles.details}>
                                        <div className={styles.detailItem}>
                                            <span
                                                className={styles.detailLabel}
                                            >
                                                Type:
                                            </span>
                                            <span>{car.type}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span
                                                className={styles.detailLabel}
                                            >
                                                Color:
                                            </span>
                                            <span>{car.color}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span
                                                className={styles.detailLabel}
                                            >
                                                Transmission:
                                            </span>
                                            <span>{car.transmission}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`#`}
                                        className={styles.ctaButton}
                                    >
                                        Book now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </section>
    );
}
