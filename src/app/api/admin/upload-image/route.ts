import cloudinary from "@/sdk/cloudinary";
import { getUriFromFile } from "@/utils/functions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get("imageFile") as File;
        if (!imageFile) {
            return NextResponse.json({ ok: false, message: "No image provided. Please attach a image" }, { status: 400 });

        }
        console.log({imageFile})
        const imageUrl = await getUriFromFile(imageFile)

        try {
            const result = await cloudinary.uploader.upload(imageUrl, {
                folder: "cars",
                resource_type: "image",
            });
            return NextResponse.json({ message: "image uploaded successfully", imageUrl: result.secure_url, imageId: result.public_id });
        } catch (error) {
            console.error(error)
            return NextResponse.json({ error: "Failed to upload new image" }, { status: 500 });
        }

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to upload new image" }, { status: 500 });
    }

}


