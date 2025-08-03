// app/api/auth/session/route.ts
import { authAdmin, firestoreAdmin } from "@/sdk/firebaseAdmin";
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
    let role: string | undefined;

    // 🔐 Decode the JWT session token
    try {
        const session = request.headers.get("Authorization")?.split(" ")[1];
        if (!session) {
            return NextResponse.json({ ok: false, message: "Authentication token is missing." }, { status: 401 });
        }

        const decoded = verify(session, process.env.JWT_SECRET!) as { uid: string; role: string };
        idToken = decoded.uid;
        role = decoded.role;

    } catch (authError) {
        console.error("Authentication error:", authError);
        return NextResponse.json({ ok: false, message: "Authentication failed" }, { status: 401 });
    }

    // 🧾 Validate decoded token
    if (!idToken) {
        return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    if (!role || role !== "admin") {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }

    // 📋 Validate request data
    if (
        !data.email ||
        !data.password ||
        !data.name
    ) {
        return NextResponse.json({ error: "Wrong signup data" }, { status: 400 });
    }

    // ✅ Create user and store role
    try {
        const userRecord = await authAdmin.createUser({
            email: data.email,
            password: data.password,
        });

        try {
            await firestoreAdmin.collection("users").doc(userRecord.uid).set({
                email: data.email,
                role: "staff",
                name:data.name
            });
        } catch (firestoreError) {
            console.error("Error writing to Firestore:", firestoreError);
            return NextResponse.json({ error: "Failed to store user data" }, { status: 500 });
        }

        return NextResponse.json({ message: "Staff account created successfully" });

    } catch (firebaseError) {
        console.error("Error creating user:", firebaseError);
        return NextResponse.json({ error: "Failed to create Firebase user" }, { status: 500 });
    }
}
