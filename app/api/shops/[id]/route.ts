import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// GET: Fetch a single shop by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Shop ID is required"}, { status: 400 });
        }
        const shop = await prisma.shop.findUnique({
            where: { id: id },
            include: {
                vendor: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!shop) {
            return NextResponse.json({ message: "Shop not found" }, { status: 404 });
        }

        return NextResponse.json(shop, { status: 200 });
    } catch (error) {
        console.error("GET /api/shops/:id error:", error);
        return NextResponse.json({ message: "Error fetching shop", error }, { status: 500 });
    }
}


// PUT: Update a shop (only the vendor can update)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { name, description, status, vendorId, type } = await req.json();

        // Validate shop exists
        const shop = await prisma.shop.findUnique({ where: { id: params.id } });
        if (!shop) {
            return NextResponse.json({ message: "Shop not found" }, { status: 404 });
        }

        // Ensure the vendor is the shop owner
        if (shop.vendorId !== vendorId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        //Validate the type.
        const validTypes = ["local_shop","grocery_shop",];
        if (!validTypes.includes(type)){
          return NextResponse.json({message:"Invalid shop type"},{status:400})
        }

        // Update shop
        const updatedShop = await prisma.shop.update({
            where: { id: params.id },
            data: { name, description, status, type },
        });

        return NextResponse.json(updatedShop, { status: 200 });
    } catch (error) {
        console.error("PUT /api/shops/:id error:", error);
        return NextResponse.json({ message: "Error updating shop", error }, { status: 500 });
    }
}

// DELETE: Remove a shop (only the vendor can delete)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { vendorId } = await req.json();

        // Validate shop exists
        const shop = await prisma.shop.findUnique({ where: { id: params.id } });
        if (!shop) {
            return NextResponse.json({ message: "Shop not found" }, { status: 404 });
        }

        // Ensure the vendor is the shop owner
        if (shop.vendorId !== vendorId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        // Delete shop
        await prisma.shop.delete({ where: { id: params.id } });

        return NextResponse.json({ message: "Shop deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/shops/:id error:", error);
        return NextResponse.json({ message: "Error deleting shop", error }, { status: 500 });
    }
}