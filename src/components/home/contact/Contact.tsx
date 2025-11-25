// src/components/Contact/Contact.tsx
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Contact.module.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import HomeHeading from "@/components/global/home-heading/HomeHeading";
import { useLocale, useTranslations } from "next-intl";
import { MessageMap } from "@/utils/types";
import toast from "react-hot-toast";

const Contact = () => {
    const t = useTranslations("Contact");
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MessageMap>();

    const onSubmit = async (data: MessageMap) => {
        try {
            setLoading(true);
            const response = await fetch("/api/messages/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to send message");
            }
            toast.success(t("form.submitSuccess"));
            reset();
        } catch (error) {
            toast.error(t("form.submitError"));
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className={`${styles.contact} ${
                locale === "ar" && styles.arContact
            }`}
            id="contact"
        >
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading text={t("heading")} />
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </div>

                <div className={styles.grid}>
                    {/* Contact Form */}
                    <div className={styles.formContainer}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className={styles.form}
                            noValidate
                        >
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    {t("form.name")}
                                </label>
                                <input
                                    disabled={loading}
                                    type="text"
                                    id="name"
                                    className={styles.input}
                                    {...register("name", {
                                        required: t(
                                            "form.errors.name.required"
                                        ),
                                        minLength: {
                                            value: 2,
                                            message: t(
                                                "form.errors.name.minLength"
                                            ),
                                        },
                                    })}
                                />
                                {errors.name && (
                                    <span className={styles.error}>
                                        {errors.name.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    {t("form.email")}
                                </label>
                                <input
                                    disabled={loading}
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    {...register("email", {
                                        required: t(
                                            "form.errors.email.required"
                                        ),
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: t(
                                                "form.errors.email.invalid"
                                            ),
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <span className={styles.error}>
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>
                                    {t("form.phone")}
                                </label>
                                <input
                                    disabled={loading}
                                    type="tel"
                                    id="phone"
                                    className={styles.input}
                                    {...register("phone", {
                                        required: t(
                                            "form.errors.phone.required"
                                        ),
                                        pattern: {
                                            value: /^[0-9+ ]+$/,
                                            message: t(
                                                "form.errors.phone.invalid"
                                            ),
                                        },
                                        minLength: {
                                            value: 8,
                                            message: t(
                                                "form.errors.phone.minLength"
                                            ),
                                        },
                                    })}
                                />
                                {errors.phone && (
                                    <span className={styles.error}>
                                        {errors.phone.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label
                                    htmlFor="subject"
                                    className={styles.label}
                                >
                                    {t("form.subject")}
                                </label>
                                <select
                                disabled={loading}
                                    id="subject"
                                    className={styles.select}
                                    {...register("subject", {
                                        required: t(
                                            "form.errors.subject.required"
                                        ),
                                    })}
                                >
                                    <option value="">
                                        {t("form.placeholder")}
                                    </option>
                                    <option value="reservation">
                                        {t("form.subjects.reservation")}
                                    </option>
                                    <option value="inquiry">
                                        {t("form.subjects.inquiry")}
                                    </option>
                                    <option value="support">
                                        {t("form.subjects.support")}
                                    </option>
                                    <option value="feedback">
                                        {t("form.subjects.feedback")}
                                    </option>
                                </select>
                                {errors.subject && (
                                    <span className={styles.error}>
                                        {errors.subject.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label
                                    htmlFor="message"
                                    className={styles.label}
                                >
                                    {t("form.message")}
                                </label>
                                <textarea
                                    id="message"
                                    disabled={loading}
                                    className={styles.textarea}
                                    rows={5}
                                    {...register("message", {
                                        required: t(
                                            "form.errors.message.required"
                                        ),
                                        minLength: {
                                            value: 10,
                                            message: t(
                                                "form.errors.message.minLength"
                                            ),
                                        },
                                    })}
                                ></textarea>
                                {errors.message && (
                                    <span className={styles.error}>
                                        {errors.message.message}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={styles.submitButton}
                            >
                                {loading?t("form.sending"):t("form.submit")}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info - remains unchanged */}
                    <div className={styles.infoContainer}>
                        <div className={styles.infoCard}>
                            <h3 className={styles.infoTitle}>
                                {t("info.title")}
                            </h3>

                            <div className={styles.infoItem}>
                                <FaPhone className={styles.infoIcon} />
                                <div>
                                    <h4 className={styles.infoLabel}>
                                        {t("info.phoneLabel")}
                                    </h4>
                                    <a
                                        href="tel:+966561741202"
                                        className={styles.infoValue}
                                    >
                                        +966 56 174 1202
                                    </a>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <FaEnvelope className={styles.infoIcon} />
                                <div>
                                    <h4 className={styles.infoLabel}>
                                        <p>{t("info.emailLabel")}</p>
                                    </h4>
                                    <a
                                        href="mailto:info@marakeb.co"
                                        className={styles.infoValue}
                                    >
                                        info@marakeb.co
                                    </a>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <FaMapMarkerAlt className={styles.infoIcon} />
                                <div>
                                    <h4 className={styles.infoLabel}>
                                        <p>{t("info.addressLabel")}</p>
                                    </h4>
                                    <p
                                        className={styles.infoValue}
                                        dangerouslySetInnerHTML={{
                                            __html: t("info.address"),
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <FaClock className={styles.infoIcon} />
                                <div>
                                    <h4 className={styles.infoLabel}>
                                        {t("info.hoursLabel")}
                                    </h4>
                                    <p
                                        className={styles.infoValue}
                                        dangerouslySetInnerHTML={{
                                            __html: t("info.hours"),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className={styles.mapContainer}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.231693986457!2d50.0888!3d26.4207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDI1JzE0LjUiTiA1MMKwMDUnMTkuNyJF!5e0!3m2!1sen!2ssa!4v1620000000000!5m2!1sen!2ssa"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                className={styles.map}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
