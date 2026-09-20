"use client";

import { FaPlus } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import LocationsTable from "@/components/admin/locations/LocationsTable";
import styles from "./AdminLocationsPage.module.css";
import { useCallback, useEffect, useState } from "react";
import { LocationMap } from "@/utils/types";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import nookies from "nookies";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function LocationsPage() {
    const t = useTranslations("Admin");
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState<LocationMap[]>([]);

    const fetchLocations = useCallback(async () => {
        try {
            setLoading(true);
            const cookies = nookies.get();
            const session = cookies["session"];
            if (!session) {
                toast.error(t("LocationsPage.authError"));
                return;
            }
            const response = await fetch(`/api/admin/get-locations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLocations(data.locations ?? []);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
            toast.error(t("LocationsPage.fetchError"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return (
        <div className={styles.locationsContainer}>
            <div className={styles.locationsHeader}>
                <h1>{t("LocationsPage.title")}</h1>
                <Link
                    href="/dashboard/admin/locations/add"
                    className={styles.addLocationBtn}
                >
                    <FaPlus /> {t("LocationsPage.addLocation")}
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
                <LocationsTable locations={locations} />
            )}
        </div>
    );
}
