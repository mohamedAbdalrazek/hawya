// src/components/Testimonials/Testimonials.tsx
import React from "react";
import styles from "./Testimonials.module.css";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import HomeHeading from "@/components/global/home-heading/HomeHeading";

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: "Ahmed Al-Sulaiman",
            role: "Business Traveler",
            rating: 5,
            content:
                "Hawya made my business trips across Saudi so convenient. The cars are always clean and well-maintained. Their service in Dammam is exceptional!",
        },
        {
            id: 2,
            name: "Sarah Al-Ghamdi",
            role: "Family Vacation",
            rating: 4,
            content:
                "We rented an SUV for our family trip from Khobar to Riyadh. The process was smooth and the child seats were perfectly installed. Highly recommend!",
        },
        {
            id: 3,
            name: "Mohammed Al-Harbi",
            role: "Monthly Rental",
            rating: 5,
            content:
                "As an expat working in Jubail, I rely on Hawya for my monthly car rentals. Their prices are fair and their staff speaks excellent English.",
        },
        {
            id: 4,
            name: "Fatima Al-Rashid",
            role: "First-time Renter",
            rating: 5,
            content:
                "I was nervous about renting a car for the first time, but Hawya staff in Dhahran guided me through everything. The car was perfect for city driving.",
        },
    ];

    return (
        <section className={styles.testimonials} id="testimonials">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading  text="What Our Customers Say"/>
                    <p className={styles.subtitle}>
                        Hear from travelers who&apos;ve experienced Hawya&apos;s 
                        car rental service across Saudi Arabia
                    </p>
                </div>

                <div className={styles.grid}>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className={styles.card}>
                            <div className={styles.quoteIcon}>
                                <FaQuoteLeft />
                            </div>
                            <div className={styles.rating}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={
                                            i < testimonial.rating
                                                ? styles.starFilled
                                                : styles.starEmpty
                                        }
                                    />
                                ))}
                            </div>
                            <p className={styles.content}>
                                {testimonial.content}
                            </p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>
                                    <span>
                                        {testimonial.name[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className={styles.authorInfo}>
                                    <h4 className={styles.name}>
                                        {testimonial.name}
                                    </h4>
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
