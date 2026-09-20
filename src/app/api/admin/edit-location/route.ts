import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import {
    isLocationWriteError,
    parseLocationWrite,
} from "@/utils/locationPayload";
import { isAuthError, requireAdmin } from "@/utils/requireAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const auth = requireAdmin(request);
    if (isAuthError(auth)) return auth;

    let data: unknown;
    try {
        data = await request.json();
    } catch (err) {
        console.error("Invalid JSON body:", err);
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }

    const id =
        data && typeof data === "object" && "id" in data
            ? String((data as { id?: unknown }).id ?? "")
            : "";
    if (!id) {
        return NextResponse.json({ error: "Missing locationId" }, { status: 400 });
    }

    const parsed = parseLocationWrite(data);
    if (isLocationWriteError(parsed)) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    try {
        const locationRef = firestoreAdmin.collection("locations").doc(id);
        const existing = await locationRef.get();
        if (!existing.exists) {
            return NextResponse.json(
                { error: "Location not found" },
                { status: 404 }
            );
        }
        await locationRef.set(parsed, { merge: false });
        return NextResponse.json({ message: "Location updated successfully" });
    } catch (error) {
        console.error("Failed to update location:", error);
        return NextResponse.json(
            { error: "Failed to update location" },
            { status: 500 }
        );
    }
}
