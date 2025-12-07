import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({message:"testing"})
}
// import { CarsImagesRepo } from "@/app/repos/cars-images-repo";
// import { NextResponse } from "next/server";
// export async function GET() {
//     try {
//         const images = await CarsImagesRepo.find()
//         return NextResponse.json(images, { status: 200 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })

//     }
// }
// export async function POST(request: Request) {
//     let data;
//     try {
//         data = await request.json()
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
//     }
//     const { imagesToBeAdded } = data
//     if (!imagesToBeAdded.length) {
//         return NextResponse.json({ error: "Please provide image id to be deleted" }, { status: 400 })

//     }
//     try {
//         const addedImages = await CarsImagesRepo.insertManyImages(imagesToBeAdded)
//         return NextResponse.json(addedImages, { status: 201 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })

//     }
// }
// export async function PUT(request: Request) {
//     let data;
//     try {
//         data = await request.json()
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
//     }
//     const { imagesToBeUpdated } = data
//     if (!imagesToBeUpdated.length) {
//         return NextResponse.json({ error: "Please provide image id to be deleted" }, { status: 400 })
//     }
//     try {
//         const updatedImages = CarsImagesRepo.updateManyImages(imagesToBeUpdated)
//         return NextResponse.json(updatedImages, { status: 201 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })

//     }
// }
// export async function DELETE(request: Request) {
//     let data;
//     try {
//         data = await request.json()
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
//     }
//     const { imagesToBeDeleted } = data
//     if (!imagesToBeDeleted.length) {
//         return NextResponse.json({ error: "Please provide image id to be deleted" }, { status: 400 })
//     }
//     try {
//         const deletedImages = await CarsImagesRepo.deleteManyImages(imagesToBeDeleted)
//         return NextResponse.json(deletedImages, { status: 200 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })
//     }
// }