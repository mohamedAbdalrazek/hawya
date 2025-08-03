"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MessagesPage.module.css";
import nookies from "nookies";
import toast from "react-hot-toast";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import { MessageAdminMap } from "@/utils/types";
import Modal from "@/components/global/modal/Modal";
import { useTranslations } from "next-intl";
import InfiniteScroll from "react-infinite-scroll-component";

export default function MessagesPage() {
    const t = useTranslations("Admin");

    const [offset, setOffset] = useState(0);
    const limit = 2;
    const [hasMore, setHasMore] = useState(true);

    const hasMounted = useRef(false);

    const [messages, setMessages] = useState<MessageAdminMap[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
    const [messageToBeDeleted, setMessageToBeDeleted] =
        useState<MessageAdminMap | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleDeleteMessage = async () => {
        if (!messageToBeDeleted) return;

        try {
            setDeleting(true);
            const cookies = nookies.get();
            const session = cookies["session"];

            if (!session) {
                toast.error(t("MessagesPage.errors.unauthorized"));
                return;
            }

            const res = await fetch(
                `/api/messages/delete?messageId=${messageToBeDeleted.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                }
            );

            await res.json();

            if (!res.ok) {
                toast.error(t("MessagesPage.errors.failedToDelete"));
            } else {
                toast.success(t("MessagesPage.success.deleted"));
                window.location.reload();
            }
        } catch {
            toast.error(t("MessagesPage.errors.genericDelete"));
        } finally {
            setShowDeleteModal(false);
            setDeleting(false);
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            console.log("test");
            const nextOffset = offset + limit;
            setOffset(nextOffset);
            fetchMessages(nextOffset, limit);
        }
    };
    const fetchMessages = useCallback(
        async function (offset: number, limit: number): Promise<void> {
            try {
                const cookies = nookies.get();
                const session = cookies["session"];
                if (!session) {
                    toast.error(t("MessagesPage.errors.unauthenticated"));
                    return;
                }
                const callParams = `?offset=${offset}&limit=${limit}`;

                const response = await fetch(`/api/messages/get${callParams}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages((prev) => [...prev, ...data.messages]);
                    if (offset + limit >= data.total) {
                        setHasMore(false);
                    }
                } else {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [t]
    );

    useEffect(() => {
        if (hasMounted.current) return; // prevent double fetch on remount
        hasMounted.current = true;
        setLoading(true);
        setMessages([]);
        setOffset(0);
        setHasMore(true);
        fetchMessages(0, limit);
    }, [fetchMessages]);

    if (loading) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <SpinLoader size="lg" />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{t("MessagesPage.title")}</h1>
                <p className={styles.subtitle}>
                    {messages.length}{" "}
                    {messages.length === 1
                        ? t("MessagesPage.subtitles.one")
                        : t("MessagesPage.subtitles.many")}
                </p>
            </header>

            <div className={styles.content}>
                {messages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>{t("MessagesPage.noMessages")}</p>
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={messages.length}
                        next={handleLoadMore}
                        hasMore={hasMore}
                        loader={<SpinLoader size="sm" />}
                        className={styles.infiniteScroll}
                    >
                        {messages.map((message, index) => (
                            <div key={index}>
                                <div
                                    key={index}
                                    className={`${styles.messageCard} ${
                                        selectedMessage === index
                                            ? styles.selected
                                            : ""
                                    }`}
                                    onClick={() => setSelectedMessage(index)}
                                >
                                    <div className={styles.messageHeader}>
                                        <h3 className={styles.messageSubject}>
                                            {t(
                                                `MessagesPage.subjects.${message.subject}`
                                            )}
                                        </h3>
                                        <span className={styles.messageFrom}>
                                            {message.name}
                                        </span>
                                    </div>
                                    <p className={styles.messagePreview}>
                                        {message.message.substring(0, 60)}
                                        ...
                                    </p>
                                    <div className={styles.messageMeta}>
                                        <span className={styles.messageDate}>
                                            {new Date(
                                                message.createTime
                                            ).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMessageToBeDeleted(message);
                                                setShowDeleteModal(true);
                                            }}
                                            className={styles.deleteButton}
                                        >
                                            {t("MessagesPage.buttons.delete")}
                                        </button>
                                    </div>
                                </div>
                                {selectedMessage !== null &&
                                    messages[selectedMessage] &&
                                    selectedMessage === index && (
                                        <div className={styles.messageDetail}>
                                            <div
                                                className={styles.detailHeader}
                                            >
                                                <h2>
                                                    {t(
                                                        `MessagesPage.subjects.${messages[selectedMessage].subject}`
                                                    )}
                                                </h2>
                                                <button
                                                    onClick={() =>
                                                        setSelectedMessage(null)
                                                    }
                                                    className={
                                                        styles.closeButton
                                                    }
                                                >
                                                    &times;
                                                </button>
                                            </div>

                                            <div className={styles.senderInfo}>
                                                <div>
                                                    <strong>
                                                        {t(
                                                            "MessagesPage.labels.from"
                                                        )}
                                                        :
                                                    </strong>{" "}
                                                    {
                                                        messages[
                                                            selectedMessage
                                                        ].name
                                                    }
                                                </div>
                                                <div>
                                                    <strong>
                                                        {t(
                                                            "MessagesPage.labels.email"
                                                        )}
                                                        :
                                                    </strong>{" "}
                                                    {
                                                        messages[
                                                            selectedMessage
                                                        ].email
                                                    }
                                                </div>
                                                <div>
                                                    <strong>
                                                        {t(
                                                            "MessagesPage.labels.phone"
                                                        )}
                                                        :
                                                    </strong>{" "}
                                                    {
                                                        messages[
                                                            selectedMessage
                                                        ].phone
                                                    }
                                                </div>
                                            </div>

                                            <div
                                                className={
                                                    styles.messageContent
                                                }
                                            >
                                                <p>
                                                    {
                                                        messages[
                                                            selectedMessage
                                                        ].message
                                                    }
                                                </p>
                                            </div>

                                            <div
                                                className={
                                                    styles.messageActions
                                                }
                                            >
                                                <button
                                                    onClick={() => {
                                                        setMessageToBeDeleted(
                                                            messages[
                                                                selectedMessage
                                                            ]
                                                        );
                                                        setShowDeleteModal(
                                                            true
                                                        );
                                                    }}
                                                    className={
                                                        styles.deleteButton
                                                    }
                                                >
                                                    {t(
                                                        "MessagesPage.buttons.deleteMessage"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </InfiniteScroll>
                )}
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={t("MessagesPage.modal.title")}
            >
                <p className={styles.modalMessage}>
                    {t("MessagesPage.modal.confirm", {
                        name: messageToBeDeleted?.name ?? "",
                    })}
                </p>
                <div className={styles.modalActions}>
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className={styles.cancelBtn}
                        disabled={deleting}
                    >
                        {deleting
                            ? t("MessagesPage.buttons.deleting")
                            : t("MessagesPage.buttons.cancel")}
                    </button>
                    <button
                        onClick={handleDeleteMessage}
                        className={styles.confirmDeleteBtn}
                        disabled={deleting}
                    >
                        {deleting
                            ? t("MessagesPage.buttons.deleting")
                            : t("MessagesPage.buttons.delete")}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
