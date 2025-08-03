import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { internalServerError } from "@/utils/responses";
import { CarMap } from "@/utils/types";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const carId = searchParams.get("carId") ?? null;
    let idToken: string | undefined;

    // 🔐 Verify session token
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

    // ❗ Validate extracted token info
    if (!idToken) {
        return NextResponse.json({ ok: false, message: "Missing ID token" }, { status: 400 });
    }
    if (carId) {
        const doc = await firestoreAdmin.collection("cars").doc(carId).get();
        if (!doc.exists) {
            return NextResponse.json(
                { ok: false, message: "Car not found" },
                { status: 404 }
            );
        }
        const car = { id: doc.id, ...doc.data() } as CarMap

        return NextResponse.json({
            ok: true,
            message: "Car retrieved successfully",
            car,
        });
    }

    try {
        const cars = (await firestoreAdmin.collection("cars").get()).docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        } as CarMap));
        return NextResponse.json({
            ok: true,
            cars,
        });
    } catch (err) {
        console.error("Failed to fetch filtered cars:", err);
        return internalServerError("Something went wrong.");
    }
}
