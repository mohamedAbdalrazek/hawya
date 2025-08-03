import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { MessageMap } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, email, message, phone, subject } = body || {};
        if (!name || !email || !message || !phone || !subject) {
            return NextResponse.json(
                { ok: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const sanitizedBody: MessageMap = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            phone: phone.trim(),
            subject: subject.trim()
        };

        const newUserRef = await firestoreAdmin.collection("messages").add(sanitizedBody);

        return NextResponse.json(
            { ok: true, message: "Message sent successfully", id: newUserRef.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Firestore Error:", error);
        return NextResponse.json(
            { ok: false, message: "Server error while sending the message" },
            { status: 500 }
        );
    }
}
