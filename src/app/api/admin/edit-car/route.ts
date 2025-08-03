// app/api/admin/edit-car/route.ts
import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
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

    if (!data.id) {
        return NextResponse.json({ error: "Missing carId" }, { status: 400 });
    }

    // Optional: validate fields like you did in add-car
    if (
        !data.availableColors ||
        !data.model ||
        !data.priceDay ||
        !data.priceMonth ||
        !data.transmission ||
        !data.type ||
        !data.year
    ) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const carRef = firestoreAdmin.collection("cars").doc(data.id);

        await carRef.update(data);

        return NextResponse.json({ message: "Car updated successfully" });
    } catch (error) {
        console.error("Failed to update car:", error);
        return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
    }
}
