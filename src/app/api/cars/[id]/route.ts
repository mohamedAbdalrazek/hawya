import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({message:"testing"})
}
// import { CarsRepo } from "@/app/repos/cars-repo";
// import { NextResponse } from "next/server";

// export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params
//     if (!id) {
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
//     }
//     try {
//         const car = await CarsRepo.findById(parseInt(id))
//         return NextResponse.json(car, { status: 200 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })
//     }
// }
// export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params
//     if (!id) {
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
//     }
//     try {
//         const car = await CarsRepo.delete(parseInt(id))
//         return NextResponse.json(car, { status: 200 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })
//     }
// }