// app/api/auth/session/route.ts
import { authAdmin } from "@/sdk/firebaseAdmin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
        }

        // Verify the Firebase ID token
        await authAdmin.verifyIdToken(idToken);
        

        // You can also check for custom claims here if needed
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const cookieStore = cookies();
        (await cookieStore).set("session", idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: expiresIn / 1000,
            path: "/",
        });

        return NextResponse.json({ message: "Session cookie set" });
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
