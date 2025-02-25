import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: Fetch all shops with vendor details
export async function GET() {
    try {
        const shops = await prisma.shop.findMany({
            include: {
                vendor: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return NextResponse.json(shops, { status: 200 });
    } catch (error) {
        console.error("GET /api/shops error:", error);
        return NextResponse.json(
            { message: "Failed to fetch shops", error },
            { status: 500 }
        );
    }
}

// POST: Create a new shop (For vendors only)
export async function POST(req: Request) {
    try {
        const { name, description, vendorId, type } = await req.json();

        // Validate required fields
        if (!name || !description || !vendorId || !type) {
            return NextResponse.json(
                { message: "Name, description, vendorId, and type are required" },
                { status: 400 }
            );
        }

        // Check if the vendor exists and has the correct role
        const vendor = await prisma.user.findUnique({
            where: { id: vendorId },
            select: { role: true },
        });

        if (!vendor || vendor.role !== "vendor") {
            return NextResponse.json(
                { message: "Only vendors can create shops" },
                { status: 403 }
            );
        }

        // Check if the vendor already has a shop
        const existingShop = await prisma.shop.findFirst({
        where: { vendorId: vendorId },
        });
        if (existingShop) {
          return NextResponse.json(
            {message: "Vendor already has an associated shop."},
            {status: 400 }
          );
        }

        //Validate the type.
        const validTypes = ["local_shop","grocery_shop"];
        if (!validTypes.includes(type)){
          return NextResponse.json({message:"Invalid shop type"},{status:400})
        }

        // Create shop
        const shop = await prisma.shop.create({
            data: {
                name,
                description,
                status: "active", // Default to active
                vendorId,
                type,
            },
        });

        return NextResponse.json(shop, { status: 201 });
    } catch (error) {
        console.error("POST /api/shops error:", error);
        return NextResponse.json(
            { message: "Failed to create shop", error },
            { status: 500 }
        );
    }
}