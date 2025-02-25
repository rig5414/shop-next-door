import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: Fetch all product catalogs
export async function GET() {
    try {
        const productCatalogs = await prisma.productCatalog.findMany();
        return NextResponse.json(productCatalogs);
    } catch (error) {
        console.error("GET /api/product-catalogs error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product catalogs", details: error },
            { status: 500 }
        );
    }
}

// POST: Create a new product catalog
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, defaultPrice, image, category } = body;

        if (!name || !description || defaultPrice === undefined || !image || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newProductCatalog = await prisma.productCatalog.create({
            data: { name, description, defaultPrice, image, category },
        });

        return NextResponse.json(newProductCatalog, { status: 201 });
    } catch (error) {
        console.error("POST /api/product-catalogs error:", error);
        return NextResponse.json(
            { error: "Failed to create product catalog", details: error },
            { status: 500 }
        );
    }
}