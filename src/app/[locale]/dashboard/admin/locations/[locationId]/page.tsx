"use client";

import { useEffect, useState } from "react";
import { LocationMap } from "@/utils/types";
import toast from "react-hot-toast";
import nookies from "nookies";
import { useParams } from "next/navigation";
import LocationForm from "@/components/admin/locations/LocationForm";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import { Link } from "@/i18n/navigation";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./EditLocationPage.module.css";
import { useTranslations } from "next-intl";

export default function EditLocationPage() {
    const t = useTranslations("Admin");
    const [location, setLocation] = useState<LocationMap | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const locationId = params.locationId;

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setLoading(true);
                const cookies = nookies.get();
                const session = cookies["session"];
                if (!session) {
                    toast.error(t("LocationsPage.authError"));
                    return;
                }
                const response = await fetch(
                    `/api/admin/get-locations?locationId=${locationId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setLocation(data.location);
                } else {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
                toast.error(t("LocationsPage.fetchError"));
            } finally {
                setLoading(false);
            }
        };
        fetchLocation();
    }, [locationId, t]);

    if (loading) {
        return (
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
        );
    }
    if (!location) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link
                    href="/dashboard/admin/locations"
                    className={styles.backLink}
                >
                    <FaArrowLeft /> {t("LocationsPage.Form.back")}
                </Link>
                <h1>{t("LocationsPage.Form.editTitle")}</h1>
            </div>
            <LocationForm mode="edit" initial={location} />
        </div>
    );
}
