"use client";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import nookies from "nookies";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { BookingFormData } from "@/utils/types";
import BookingsTable from "@/components/admin/bookings/BookingsTable";
import FilterBookings from "@/components/admin/bookings/FilterBookings";
import ActiveFilters from "@/components/admin/bookings/ActiveFilters";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import styles from "./BookingsPage.module.css";
export default function Page() {
    const hasMounted = useRef(false);
    const prevFilterKey = useRef("");

    const t = useTranslations("Admin");

    const [bookings, setBookings] = useState<BookingFormData[]>([]);

    const [offset, setOffset] = useState(0);
    const limit = 8;
    const [hasMore, setHasMore] = useState(true);

    const [filters, setFilters] = useState({
        date: "",
        model: "",
        phone: "",
        name: "",
    });
    const filterKey = useMemo(() => {
        return Object.entries(filters)
            .filter(([, value]) => value)
            .map(([k, v]) => `${k}:${v}`)
            .sort()
            .join("|");
    }, [filters]);
    const handleChangeFilter = (key: string, value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value,
        }));
    };

    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(
        async (
            filters: {
                date: string;
                model: string;
                phone: string;
                name: string;
            },
            offset: number,
            limit: number,
            isNewFilter :boolean
        ): Promise<void> => {
            try {
                let callParams = `?offset=${offset}&limit=${limit}`;
                for (const [field, value] of Object.entries(filters)) {
                    if (value) {
                        callParams += `&${field}=${encodeURIComponent(value)}`;
                    }
                }

                const cookies = nookies.get();
                const session = cookies["session"];
                if (!session) {
                    toast.error(t("BookingsPage.unauthenticated"));
                    return;
                }

                const response = await fetch(`/api/getBookings${callParams}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if(isNewFilter)
                        setBookings(data.bookings);
                        
                    else
                        setBookings((prev) => [...prev, ...data.bookings]);
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
        },
        [t]
    );
    const handleLoadMore = () => {
        if (hasMore && !loading) {
            const nextOffset = offset + limit;
            fetchBookings(filters, nextOffset, limit, false);
            setOffset(nextOffset);
        }
    };

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            prevFilterKey.current = filterKey;
        } else if (prevFilterKey.current === filterKey) {
            return; // no change
        }

        prevFilterKey.current = filterKey;
        setLoading(true);
        setBookings([]);
        setOffset(0);
        setHasMore(true);

        fetchBookings(filters, 0, limit, true);
    }, [filters, filterKey, fetchBookings]);

    return (
        <div className={styles.bookingsContainer}>
            <div className={styles.bookingsHeader}>
                <h1>{t("BookingsPage.title")}</h1>
            </div>

            <ActiveFilters
                filters={filters}
                handleChangeFilters={handleChangeFilter}
            />
            <FilterBookings
                filters={filters}
                handleChangeFilters={handleChangeFilter}
            />

            {loading ? (
                <div
                    style={{
                        width: "100%",
                        height: "50vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <SpinLoader size="lg" />
                </div>
            ) : (
                <BookingsTable
                    handleLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    bookings={bookings}
                />
            )}
        </div>
    );
}
