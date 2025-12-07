import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({message:"testing"})
}
// import { ModelRepo } from "@/app/repos/models-repo";
// import { NextResponse } from "next/server";

// export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params;
//     if (!id) {
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

//     }
//     try {
//         const model = await ModelRepo.findById(parseInt(id))
//         if (model) {
//             return NextResponse.json(model, { status: 200 })
//         } else {
//             return NextResponse.json({ error: `Couldn't find this model` }, { status: 404 })
//         }
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })
//     }
// }
// export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
//     let id, data;
//     try {
//         id = (await params).id
//         data = await request.json()
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
//     }
//     if (!id || !data.name || data.brandId || !data.bodyType || !data.productionYear || !data.transmission) {
//         return NextResponse.json({ error: "Some data are missing" }, { status: 400 })
//     }
//     try {
//         const model = await ModelRepo.update(parseInt(id), data.name, data.brandId, data.bodyType, data.productionYear, data.transmission)
//         return NextResponse.json(model, { status: 201 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })
//     }
// }
// export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params;
//     if (!id) {
//         return NextResponse.json({ error: "Some data are missing" }, { status: 400 })
//     }
//     try {
//         const model = await ModelRepo.delete(parseInt(id))
//         return NextResponse.json(model, { status: 200 })
//     } catch (error) {
//         console.log(error)
//         return NextResponse.json("Something went wrong in the server side", { status: 500 })
//     }
// }