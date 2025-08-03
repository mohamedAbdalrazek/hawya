"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./StaffLogin.module.css";
import { auth } from "@/sdk/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function StaffLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations("StaffLogin");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const result = await signInWithEmailAndPassword(auth, email, password);
            const token = await result.user.getIdToken();

            const res = await fetch("/api/admin/set-cookie", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                if (data.role === "admin" || data.role === "staff") {
                    router.push("/dashboard/admin");
                }
            } else {
                setError(t("accessDenied"));
            }
        } catch (error) {
            let message = t("error.default");
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case "auth/invalid-email":
                        message = t("error.invalidEmail");
                        break;
                    case "auth/user-disabled":
                        message = t("error.userDisabled");
                        break;
                    case "auth/user-not-found":
                        message = t("error.userNotFound");
                        break;
                    case "auth/wrong-password":
                        message = t("error.wrongPassword");
                        break;
                    case "auth/too-many-requests":
                        message = t("error.tooManyRequests");
                        break;
                    case "auth/network-request-failed":
                        message = t("error.network");
                        break;
                    default:
                        message = error.code
                            .replace("auth/", "")
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase());
                        break;
                }
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{t("title")}</h1>
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            {t("email")}
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            {t("password")}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? t("signingIn") : t("signIn")}
                    </button>
                </form>
            </div>
        </div>
    );
}
