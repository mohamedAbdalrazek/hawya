import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

type AdminSession = { uid: string; role: "admin" };

export function requireAdmin(
    request: NextRequest
): AdminSession | NextResponse {
    const session = request.headers.get("Authorization")?.split(" ")[1];
    if (!session) {
        return NextResponse.json(
            { ok: false, message: "Authentication token is missing." },
            { status: 401 }
        );
    }

    try {
        const decoded = verify(session, process.env.JWT_SECRET!) as {
            uid: string;
            role: string;
        };
        if (!decoded.uid) {
            return NextResponse.json(
                { error: "Missing ID token" },
                { status: 400 }
            );
        }
        if (decoded.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized User" },
                { status: 401 }
            );
        }
        return { uid: decoded.uid, role: "admin" };
    } catch (authError) {
        console.error("Authentication error:", authError);
        return NextResponse.json(
            { ok: false, message: "Authentication failed" },
            { status: 401 }
        );
    }
}

export function isAuthError(
    value: AdminSession | NextResponse
): value is NextResponse {
    return value instanceof NextResponse;
}
