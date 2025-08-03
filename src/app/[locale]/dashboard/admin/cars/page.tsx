"use client";

import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import CarsTable from "@/components/admin/cars/CarsTable";
import styles from "./AdminCarsPage.module.css";
import { useCallback, useEffect, useState } from "react";
import { CarMap } from "@/utils/types";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import nookies from "nookies";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function CarsPage() {
    const t = useTranslations("Admin");
    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState<CarMap[]>([]);

    const fetchCars = useCallback(async () => {
        try {
            setLoading(true);
            const cookies = nookies.get();
            const session = cookies["session"];
            if (!session) {
                toast.error(t("CarsPage.authError"));
                return;
            }
            const response = await fetch(`/api/admin/get-cars`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCars(data.cars);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
            toast.error(t("CarsPage.fetchError"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    return (
        <div className={styles.carsContainer}>
            <div className={styles.carsHeader}>
                <h1>{t("CarsPage.title")}</h1>
                <Link
                    href="/dashboard/admin/cars/add"
                    className={styles.addCarBtn}
                >
                    <FaPlus /> {t("CarsPage.addCar")}
                </Link>
            </div>

            {loading ? (
                <div
                    style={{
                        width: "100%",
                        height: "70vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <SpinLoader size="lg" />
                </div>
            ) : (
                <CarsTable cars={cars} />
            )}
        </div>
    );
}
