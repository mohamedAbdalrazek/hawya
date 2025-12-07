import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({message:"testing"})
}
// import { BrandsRepo } from "@/app/repos/brands-repo"
// import { NextResponse } from "next/server"

// export async function PUT(req: Request,
//     { params }: { params: Promise<{ id: string }> }
// ) {
//     let name, id
//     try {

//         id = (await params).id
//         name = (await req.json()).name
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

//     }
//     if (!id || !name) {
//         return NextResponse.json({ error: "Some data are missing" }, { status: 400 })
//     }
//     let brand
//     try {

//         brand = await BrandsRepo.update(parseInt(id), name)
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Somthing went wrong in the server" }, { status: 500 })

//     }
//     if (brand) { return NextResponse.json(brand, { status: 201 }) }

//     return NextResponse.json({ error: `Can't find a brand with id = ${id}` }, { status: 404 })
// }

// export async function DELETE(
//     req: Request,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     const { id } = await params
//     if (!id) {
//         return NextResponse.json({ error: "brand id is missing" }, { status: 400 })
//     }

//     try {
//         const brand = await BrandsRepo.delete(parseInt(id))
//         if (brand) { return NextResponse.json(brand, { status: 200 }) }
//         else {
//             return NextResponse.json({ error: `Can't find a brand with id = ${id}` }, { status: 404 })
//         }
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Somthing went wrong in the server" }, { status: 500 })

//     }

// }