"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import styles from "./FleetPreview.module.css";
import "swiper/css";
import "swiper/css/pagination";

export default function CarImagesSlider({ images }: { images: string[] }) {
    const swiperRef = useRef<SwiperClass>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className={styles.sliderContainer}>
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                modules={[Pagination]}
                className={styles.customSwiper}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className={styles.imageContainer}>
                        <Image
                            src={image}
                            alt={`Car ${index + 1}`}
                            fill
                            className={styles.image}
                            loading={index !==0 ?"lazy":"eager"}
                            priority={index === 0} // Load first image with priority
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Pagination */}
            <div className={styles.customPagination}>
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.customBullet} ${
                            activeIndex === index ? styles.customBulletActive : ""
                        }`}
                        onClick={() => swiperRef.current?.slideTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
