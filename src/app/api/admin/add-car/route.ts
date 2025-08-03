// app/api/auth/session/route.ts
import {firestoreAdmin } from "@/sdk/firebaseAdmin";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let data;

    try {
        data = await request.json();
    } catch (err) {
        console.error("Invalid JSON body:", err);
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    let idToken: string | undefined;

    try {
        const session = request.headers.get("Authorization")?.split(" ")[1];
        if (!session) {
            return NextResponse.json({ ok: false, message: "Authentication token is missing." }, { status: 401 });
        }

        const decoded = verify(session, process.env.JWT_SECRET!) as { uid: string; role: string };
        idToken = decoded.uid;

    } catch (authError) {
        console.error("Authentication error:", authError);
        return NextResponse.json({ ok: false, message: "Authentication failed" }, { status: 401 });
    }

    if (!idToken) {
        return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }



    if (
        !data.availableColors ||
        !data.availableColors.length ||
        !data.model ||
        !data.priceDay ||
        !data.priceMonth ||
        !data.transmission ||
        !data.type ||
        !data.year 
    ) {
        return NextResponse.json({ error: "Please provide all the required data" }, { status: 400 });
    }

    try {
        try {
            await firestoreAdmin.collection("cars").add(
                data
            );
        } catch (firestoreError) {
            console.error("Error writing to Firestore:", firestoreError);
            return NextResponse.json({ error: "Failed to store new car" }, { status: 500 });
        }

        return NextResponse.json({ message: "car added successfully" });

    } catch (firebaseError) {
        console.error("Error creating user:", firebaseError);
        return NextResponse.json({ error: "Failed to create Firebase user" }, { status: 500 });
    }
}
