import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: Fetch all product catalogs
export async function GET() {
    try {
        const productCatalogs = await prisma.productCatalog.findMany();

        const updatedProductCatalogs = productCatalogs.map(product => {
            console.log("Original Image Path:", product.image);
        
            let formattedImage = "/placeholder-product.jpg";
        
            if (product.image) {
                formattedImage = product.image.replace(/\/{2,}/g, "/");
            }
        
            console.log("Formatted Image Path:", formattedImage);
        
            return {
                ...product,
                image: formattedImage
            };
        });

        console.log("Final Product Data Sent:", updatedProductCatalogs);

        return NextResponse.json(updatedProductCatalogs);
    } catch (error) {
        console.error("GET /api/product-catalog error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Failed to fetch product catalogs" }, { status: 500 });
    }
}


// POST: Create a new product catalog
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, defaultPrice, image, category } = body;

        if (!name || !description || typeof defaultPrice !== "number" || !image || !category) {
            return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
        }

        const relativeImagePath = image.substring(image.lastIndexOf('/') + 1);

        const newProductCatalog = await prisma.productCatalog.create({
            data: { name, description, defaultPrice, image: relativeImagePath, category },
        });

        return NextResponse.json({
            ...newProductCatalog,
            image: `/images/${newProductCatalog.image}`
        }, { status: 201 });
    } catch (error) {
        console.error("POST /api/product-catalog error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Failed to create product catalog" }, { status: 500 });
    }
}
