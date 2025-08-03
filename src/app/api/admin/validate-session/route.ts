import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        // 1. Validate Authorization header presence
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { ok: false, message: "Invalid or missing Authorization header." },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        // 2. Decode and verify JWT
        const decoded = verify(token, process.env.JWT_SECRET!) as {
            uid: string;
            role: string;
        };

        if (!decoded?.uid || !decoded?.role) {
            return NextResponse.json(
                { ok: false, message: "Token missing required fields." },
                { status: 400 }
            );
        }

        return NextResponse.json({
            ok: true,
            message: "Authentication successful",
            role: decoded.role,
        });

    } catch (error) {
        console.error("JWT verification failed:", error);
        return NextResponse.json(
            { ok: false, message: "Authentication failed" },
            { status: 401 }
        );
    }
}
