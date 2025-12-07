import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({message:"testing"})
}
// import { CarsImagesRepo } from "@/app/repos/cars-images-repo"
// import { NextResponse } from "next/server"

// export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params
//     if (!id) {
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 })

//     }
//     try {
//         const image = await CarsImagesRepo.findById(parseInt(id))
//         return NextResponse.json(image, { status: 200 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })
//     }
// }
// export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params
//     if (!id) {
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
//     }
//     try {
//         const image = await CarsImagesRepo.delete(parseInt(id))
//         return NextResponse.json(image, { status: 200 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })
//     }
// }
// export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
//     let data, id;
//     try {
//         id = (await params).id
//         data = await request.json()
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
//     }
//     if (!id || !data.url || !data.carId || !data.altText) {
//         return NextResponse.json({ error: "Some data are missing" }, { status: 400 })
//     }
//     try {
//         const image = await CarsImagesRepo.update(parseInt(id), data.url, data.carId, data.altText)
//         return NextResponse.json(image, { status: 201 })
//     }catch(error){
//         console.error(error)
//         return NextResponse.json({error:"Something went wrong in the server side"}, {status:500})
//     }
// }