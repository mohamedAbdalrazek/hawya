// src/components/Contact/Contact.tsx
"use client";
import React, { useState } from "react";
import styles from "./Contact.module.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Contact = () => {
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
        <section className={styles.contact} id="contact">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Contact Us</h2>
                    <p className={styles.subtitle}>
                        Get in touch with Hawya Car Rental for inquiries,
                        reservations, or support
                    </p>
                </div>

                <div className={styles.grid}>
                    {/* Contact Form */}
                    <div className={styles.formContainer}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    Full Name
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
                                    Email Address
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
                                    Phone Number
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
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={styles.select}
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    <option value="reservation">
                                        Car Reservation
                                    </option>
                                    <option value="inquiry">
                                        General Inquiry
                                    </option>
                                    <option value="support">
                                        Customer Support
                                    </option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label
                                    htmlFor="message"
                                    className={styles.label}
                                >
                                    Message
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
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.infoContainer}>
                        <div className={styles.infoCard}>
                            <h3 className={styles.infoTitle}>
                                Contact Information
                            </h3>

                            <div className={styles.infoItem}>
                                <FaPhone className={styles.infoIcon} />
                                <div>
                                    <h4 className={styles.infoLabel}>Phone</h4>
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
                                    <h4 className={styles.infoLabel}>Email</h4>
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
                                        Main Office
                                    </h4>
                                    <p className={styles.infoValue}>
                                        King Fahd Road, Al Shati District
                                        <br />
                                        Dammam, Eastern Province
                                        <br />
                                        Saudi Arabia
                                    </p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <FaClock className={styles.infoIcon} />
                                <div>
                                    <h4 className={styles.infoLabel}>
                                        Business Hours
                                    </h4>
                                    <p className={styles.infoValue}>
                                        Sunday - Thursday: 8:00 AM - 8:00 PM
                                        <br />
                                        Friday - Saturday: 10:00 AM - 6:00 PM
                                    </p>
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
