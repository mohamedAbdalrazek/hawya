// src/components/Contact/Contact.tsx
"use client";
import React, { useState } from "react";
import styles from "./Contact.module.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import HomeHeading from "@/components/global/home-heading/HomeHeading";
import { useLocale, useTranslations } from "next-intl";

const Contact = () => {
    const t = useTranslations("Contact");
    const locale = useLocale()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
        // Add your form submission logic here
    };

    return (
        <section className={`${styles.contact} ${locale==="ar"&& styles.arContact}`} id="contact">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading text={t("heading")} />
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </div>

                <div className={styles.grid}>
                    {/* Contact Form */}
                    <div className={styles.formContainer}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    {t("form.name")}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    {t("form.email")}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>
                                    {t("form.phone")}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label
                                    htmlFor="subject"
                                    className={styles.label}
                                >
                                    {t("form.subject")}
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={styles.select}
                                    required
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
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    rows={5}
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                            >
                                {t("form.submit")}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.infoContainer}>
                        <div className={styles.infoCard}>
                            <h3 className={styles.infoTitle}>
                                {t("info.title")}
                            </h3>

                            <div className={styles.infoItem}>
                                <FaPhone className={styles.infoIcon} />
                                <div>
                                    <h4 className={styles.infoLabel}>
                                        {t("info.phoneLabel")}</h4>
                                    
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
                                        href="mailto:info@hawyarental.com"
                                        className={styles.infoValue}
                                    >
                                        info@hawyarental.com
                                    </a>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <FaMapMarkerAlt className={styles.infoIcon} />
                                <div>
                                    <h4 className={styles.infoLabel}>
                                        <p>{t("info.addressLabel")}</p>
                                    </h4>
                                    
                                    <p className={styles.infoValue} dangerouslySetInnerHTML={{__html:t("info.address")}} /> 
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <FaClock className={styles.infoIcon} />
                                <div>
                                    <h4 className={styles.infoLabel}>
                                        {t("info.hoursLabel")}
                                    </h4>
                                    <p className={styles.infoValue} dangerouslySetInnerHTML={{__html:t("info.hours")}} />                                        
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
