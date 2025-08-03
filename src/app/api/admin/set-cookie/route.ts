// app/api/auth/session/route.ts
import { authAdmin, firestoreAdmin } from "@/sdk/firebaseAdmin";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        let idToken
        try {
            const token = request.headers.get("Authorization")?.split(" ")[1];
            if (!token) return Response.json({ ok: false, message: "Authentication token is missing." }, { status: 401 });

            idToken = await authAdmin.verifyIdToken(token);
        } catch (authError) {
            console.error("Authentication error:", authError);
            return Response.json({ ok: false, message: "Authentication failed" }, { status: 401 });
        }

        if (!idToken) {
            return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
        }

        // Verify the Firebase ID token

        const userDoc = await firestoreAdmin.collection("users").doc(idToken.uid).get();
        const userData = userDoc.data();
        if (!userData?.role) {
            return NextResponse.json({ error: "No role assigned" }, { status: 403 });
        }
        const signedSession = sign({ uid: idToken.uid, role: userData.role }, process.env.JWT_SECRET!, {
            expiresIn: "5d"
        });

        
        const expiresIn = 60 * 60 * 24 * 5 * 1000; 
        const cookieStore = cookies();

        (await cookieStore).set("session",signedSession, {
            secure: true,
            maxAge: expiresIn / 1000,
            path: "/",
        });

        return NextResponse.json({ message: "Session cookie set", role:userData.role  });
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
