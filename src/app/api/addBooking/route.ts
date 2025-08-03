import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { ok: false, message: "Invalid request body" },
                { status: 400 }
            );
        }

        const newUserRef = await firestoreAdmin.collection("bookings").add(body);

        return NextResponse.json(
            { ok: true, message: "Booking added successfully", id: newUserRef.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Firestore Error:", error);
        return NextResponse.json(
            { ok: false, message: "Server error while adding the booking" },
            { status: 500 }
        );
    }
}
