import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";

// GET: Fetch a single shop by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const Resolvedparams = await params;
        const id = Resolvedparams.id;
        const shop = await prisma.shop.findUnique({
            where: { id },
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
export async function PUT(req: Request, context: { params: { id: string } }) {
    try {
        // Await the params object
        const params = await context.params;
        const id = params.id;
        
        const { name, description, status, type } = await req.json();


        // Validate shop exists
        const shop = await prisma.shop.findUnique({ where: { id } });
        if (!shop) {
            return NextResponse.json({ message: "Shop not found" }, { status: 404 });
        }

    
        // Validate the type only if it's provided
        if (type !== undefined) {
            const validTypes = ["local_shop", "grocery_shop"];
            if (!validTypes.includes(type)){
              return NextResponse.json({message: "Invalid shop type"}, {status: 400})
            }
        }

        // Create update data object with only provided fields
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (type !== undefined) updateData.type = type;

        // Update shop
        const updatedShop = await prisma.shop.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updatedShop, { status: 200 });
    } catch (error) {
        console.error("PUT /api/shops/:id error:", error);
        return NextResponse.json({ message: "Error updating shop", error }, { status: 500 });
    }
}

// DELETE: Remove a shop (admin or the shop's vendor can delete)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        console.log('DELETE request received for shop ID:', params.id);
        
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        // First delete all products associated with the shop
        await prisma.product.deleteMany({
            where: {
                shopId: params.id
            }
        });

        // Then delete the shop
        await prisma.shop.delete({
            where: { 
                id: params.id 
            }
        });

        return NextResponse.json({ message: "Shop deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("DELETE /api/shops/:id detailed error:", {
            name: error?.name,
            message: error?.message,
            code: error?.code,
            meta: error?.meta
        });

        return NextResponse.json({ 
            message: "Database error occurred while deleting shop",
            error: process.env.NODE_ENV === 'development' ? {
                message: error?.message,
                code: error?.code,
                meta: error?.meta
            } : undefined
        }, { status: 500 });
    }
}