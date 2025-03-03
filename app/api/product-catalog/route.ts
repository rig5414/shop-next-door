import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: Fetch all product catalogs
export async function GET() {
    try {
        const productCatalogs = await prisma.productCatalog.findMany();

        // Add full image URL dynamically
        const updatedProductCatalogs = productCatalogs.map(product => ({
            ...product,
            image: product.image ? `/images/${product.image}` : "/placeholder-product.jpg", // Construct full image path
        }));

        return NextResponse.json(updatedProductCatalogs);
    } catch (error: unknown) {
        console.error("GET /api/product-catalog error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product catalogs", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// POST: Create a new product catalog
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, defaultPrice, image, category } = body;

        if (!name || !description || defaultPrice == null || !image || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Extract the relative image path (e.g., "maizeflour.jpg")
        const relativeImagePath = image.substring(image.lastIndexOf('/') + 1);

        const newProductCatalog = await prisma.productCatalog.create({
            data: { name, description, defaultPrice, image: relativeImagePath, category },
        });

        return NextResponse.json({
            ...newProductCatalog,
            image: `/images/${newProductCatalog.image}` // Include the full image URL in the response
        }, { status: 201 });
    } catch (error: unknown) {
        console.error("POST /api/product-catalog error:", error);
        return NextResponse.json(
            { error: "Failed to create product catalog", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}