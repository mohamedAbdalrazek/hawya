import cloudinary from "@/sdk/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const imageId = searchParams.get("imageId");

        if (!imageId) {
            return NextResponse.json(
                { ok: false, message: "No imageId provided" },
                { status: 400 }
            );
        }

        try {
            const result = await cloudinary.uploader.destroy(imageId, {
                resource_type: "image",
            });

            if (result.result === "ok") {
                return NextResponse.json({ message: "Image deleted successfully", imageId });
            } else {
                console.error(result)
                return NextResponse.json(
                    { message: "Failed to delete image" },
                    { status: 500 }
                );
            }
        } catch (error) {
            console.error("Cloudinary error:", error);
            return NextResponse.json(
                { error: "Failed to delete image from Cloudinary" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
