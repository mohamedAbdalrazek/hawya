"use client";

import { createDailyHours, WEEKDAYS } from "@/utils/locationHours";
import { DayHours, LocationMap, LocationWrite, Weekday } from "@/utils/types";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import nookies from "nookies";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./LocationForm.module.css";

type LocationFormProps = {
    mode: "add" | "edit";
    initial?: LocationMap;
};

export default function LocationForm({ mode, initial }: LocationFormProps) {
    const t = useTranslations("Admin.LocationsPage");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [nameEn, setNameEn] = useState(initial?.name.en ?? "");
    const [nameAr, setNameAr] = useState(initial?.name.ar ?? "");
    const [addressEn, setAddressEn] = useState(initial?.address.en ?? "");
    const [addressAr, setAddressAr] = useState(initial?.address.ar ?? "");
    const [phone, setPhone] = useState(initial?.phone ?? "");
    const [sortOrder, setSortOrder] = useState(
        initial?.sortOrder?.toString() ?? "1"
    );
    const [mapsLink, setMapsLink] = useState("");
    const [previewedLink, setPreviewedLink] = useState("");
    const [pin, setPin] = useState<{ lat: number; lng: number } | null>(
        initial ? { lat: initial.lat, lng: initial.lng } : null
    );
    const [hours, setHours] = useState(
        initial?.hours ?? createDailyHours("08:00", "22:00")
    );

    const updateDay = (day: Weekday, patch: Partial<DayHours>) => {
        setHours((prev) => ({
            ...prev,
            [day]: { ...prev[day], ...patch },
        }));
    };

    const resolvePin = async (session: string) => {
        const url = mapsLink.trim();
        if (!url) return null;
        const response = await fetch("/api/admin/resolve-maps-link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session}`,
            },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            toast.error(t("Form.previewFailed"));
            return null;
        }
        const data = await response.json();
        const nextPin = { lat: Number(data.lat), lng: Number(data.lng) };
        setPin(nextPin);
        setPreviewedLink(url);
        return nextPin;
    };

    const handlePreview = async () => {
        const cookies = nookies.get();
        const session = cookies["session"];
        if (!session) {
            toast.error(t("authError"));
            return;
        }
        if (!mapsLink.trim()) {
            toast.error(t("Form.invalidLink"));
            return;
        }
        setPreviewing(true);
        try {
            await resolvePin(session);
        } catch {
            toast.error(t("Form.previewFailed"));
        } finally {
            setPreviewing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const cookies = nookies.get();
            const session = cookies["session"];
            if (!session) {
                toast.error(t("authError"));
                return;
            }

            let nextPin = pin;
            if (mapsLink.trim() && previewedLink !== mapsLink.trim()) {
                nextPin = await resolvePin(session);
            }
            if (!nextPin) {
                toast.error(t("Form.previewRequired"));
                return;
            }

            const payload: LocationWrite & { id?: string } = {
                name: { en: nameEn.trim(), ar: nameAr.trim() },
                address: { en: addressEn.trim(), ar: addressAr.trim() },
                phone: phone.trim(),
                hours,
                lat: nextPin.lat,
                lng: nextPin.lng,
                sortOrder: Number(sortOrder),
            };
            if (mode === "edit" && initial) {
                payload.id = initial.id;
            }

            const response = await fetch(
                mode === "add"
                    ? "/api/admin/add-location"
                    : "/api/admin/edit-location",
                {
                    method: mode === "add" ? "POST" : "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                toast.success(
                    mode === "add" ? t("Form.successAdd") : t("Form.successEdit")
                );
                router.push("/dashboard/admin/locations");
            } else {
                toast.error(t("Form.error"));
            }
        } catch (err) {
            console.error("Error saving location:", err);
            toast.error(t("Form.error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="nameEn">{t("Form.nameEn")}</label>
                    <input
                        id="nameEn"
                        type="text"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="nameAr">{t("Form.nameAr")}</label>
                    <input
                        id="nameAr"
                        type="text"
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="addressEn">{t("Form.addressEn")}</label>
                    <textarea
                        id="addressEn"
                        value={addressEn}
                        onChange={(e) => setAddressEn(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="addressAr">{t("Form.addressAr")}</label>
                    <textarea
                        id="addressAr"
                        value={addressAr}
                        onChange={(e) => setAddressAr(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="phone">{t("Form.phone")}</label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="sortOrder">{t("Form.sortOrder")}</label>
                    <input
                        id="sortOrder"
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="mapsLink">{t("Form.mapsLink")}</label>
                <p className={styles.help}>
                    {mode === "edit"
                        ? t("Form.mapsLinkEditHelp")
                        : t("Form.mapsLinkHelp")}
                </p>
                <div className={styles.mapsRow}>
                    <input
                        id="mapsLink"
                        type="url"
                        value={mapsLink}
                        onChange={(e) => setMapsLink(e.target.value)}
                        disabled={loading || previewing}
                        placeholder="https://maps.app.goo.gl/..."
                    />
                    <button
                        type="button"
                        className={styles.previewButton}
                        onClick={handlePreview}
                        disabled={loading || previewing || !mapsLink.trim()}
                    >
                        {previewing ? t("Form.previewing") : t("Form.preview")}
                    </button>
                </div>
            </div>

            {pin && (
                <iframe
                    className={styles.mapPreview}
                    title="Map pin preview"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${pin.lat},${pin.lng}&z=14&output=embed`}
                />
            )}

            <div className={styles.formGroup}>
                <label>{t("Form.hoursLabel")}</label>
                <div className={styles.hoursGrid}>
                    {WEEKDAYS.map((day) => (
                        <div key={day} className={styles.hoursRow}>
                            <span className={styles.dayLabel}>
                                {t(`Form.weekdays.${day}`)}
                            </span>
                            <label className={styles.closedLabel}>
                                <input
                                    type="checkbox"
                                    checked={hours[day].closed}
                                    onChange={(e) =>
                                        updateDay(day, {
                                            closed: e.target.checked,
                                        })
                                    }
                                    disabled={loading}
                                />
                                {t("Form.closed")}
                            </label>
                            <label className={styles.timeField}>
                                <span>{t("Form.open")}</span>
                                <input
                                    type="time"
                                    value={hours[day].open}
                                    onChange={(e) =>
                                        updateDay(day, { open: e.target.value })
                                    }
                                    disabled={loading || hours[day].closed}
                                    required={!hours[day].closed}
                                />
                            </label>
                            <label className={styles.timeField}>
                                <span>{t("Form.close")}</span>
                                <input
                                    type="time"
                                    value={hours[day].close}
                                    onChange={(e) =>
                                        updateDay(day, {
                                            close: e.target.value,
                                        })
                                    }
                                    disabled={loading || hours[day].closed}
                                    required={!hours[day].closed}
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className={styles.submitButton}
                type="submit"
                disabled={loading}
            >
                {loading
                    ? t("Form.loading")
                    : mode === "add"
                      ? t("Form.submitAdd")
                      : t("Form.submitEdit")}
            </button>
        </form>
    );
}
