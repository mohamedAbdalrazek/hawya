"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./AddStaffForm.module.css";
import { useState } from "react";

import nookies from "nookies";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

type FormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function AddStaffForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const t = useTranslations("Admin");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        const cookies = nookies.get();
        const session = cookies["session"];

        if (!session) {
            toast.error(t("AddStaffPage.notAuthenticated"));
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch("/api/admin/addStaff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            switch (response.status) {
                case 200:
                    toast.success(t("AddStaffPage.success"));
                    router.push("/dashboard/admin/staff");
                    break;
                case 400:
                    toast.error(t("AddStaffPage.badRequest"));
                    break;
                case 401:
                    toast.error(t("AddStaffPage.unauthorized"));
                    break;
                case 500:
                    toast.error(t("AddStaffPage.serverError"));
                    break;
                default:
                    toast.error(t("AddStaffPage.unexpectedError"));
                    console.error("Unhandled response:", result);
                    break;
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(t("AddStaffPage.submitError"));
        } finally {
            setIsSubmitting(false);
        }
        // Reset the form and submission state
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                    {t("AddStaffPage.name")}
                </label>
                <input
                    id="name"
                    className={`${styles.input} ${
                        errors.name ? styles.inputError : ""
                    }`}
                    {...register("name", {
                        required: t("AddStaffPage.errors.nameRequired"),
                    })}
                />
                {errors.name && (
                    <span className={styles.errorMessage}>
                        {errors.name.message}
                    </span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                    {t("AddStaffPage.email")}
                </label>
                <input
                    id="email"
                    type="email"
                    className={`${styles.input} ${
                        errors.email ? styles.inputError : ""
                    }`}
                    {...register("email", {
                        required: t("AddStaffPage.errors.emailRequired"),
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: t("AddStaffPage.errors.emailInvalid"),
                        },
                    })}
                />
                {errors.email && (
                    <span className={styles.errorMessage}>
                        {errors.email.message}
                    </span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                    {t("AddStaffPage.password")}
                </label>
                <div className={styles.passwordInput}>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={`${styles.input} ${
                            errors.password ? styles.inputError : ""
                        }`}
                        {...register("password", {
                            required: t("AddStaffPage.errors.passwordRequired"),
                            minLength: {
                                value: 8,
                                message: t("AddStaffPage.errors.passwordMin"),
                            },
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.passwordToggle}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {errors.password && (
                    <span className={styles.errorMessage}>
                        {errors.password.message}
                    </span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                    {t("AddStaffPage.confirmPassword")}
                </label>
                <div className={styles.passwordInput}>
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className={`${styles.input} ${
                            errors.confirmPassword ? styles.inputError : ""
                        }`}
                        {...register("confirmPassword", {
                            required: t("AddStaffPage.errors.confirmRequired"),
                            validate: (value) =>
                                value === watch("password") ||
                                t("AddStaffPage.errors.passwordMismatch"),
                        })}
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={styles.passwordToggle}
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <span className={styles.errorMessage}>
                        {errors.confirmPassword.message}
                    </span>
                )}
            </div>

            <div className={styles.formActions}>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? t("AddStaffPage.creating")
                        : t("AddStaffPage.submit")}
                </button>
            </div>
        </form>
    );
}
