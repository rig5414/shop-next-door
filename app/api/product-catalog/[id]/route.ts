import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// GET: Fetch a single product catalog by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "Product catalog ID is required" }, { status: 400 });
        }

        const productCatalog = await prisma.productCatalog.findUnique({
            where: { id: params.id },
        });

        if (!productCatalog) {
            return NextResponse.json({ error: "Product catalog not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...productCatalog,
            image: productCatalog.image ? `/images/${productCatalog.image}` : "/placeholder-product.jpg"
        });
        
    } catch (error: unknown) {
        console.error("GET /api/product-catalog/:id error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product catalog", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// PUT: Update a product catalog by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "Product catalog ID is required" }, { status: 400 });
        }

        const body = await req.json();
        const { name, description, defaultPrice, image, category } = body;

        if (!name && !description && defaultPrice == null && !image && !category) {
            return NextResponse.json({ error: "At least one field must be provided to update" }, { status: 400 });
        }

        const updatedProductCatalog = await prisma.productCatalog.update({
            where: { id: params.id },
            data: { name, description, defaultPrice, image, category },
        });

        return NextResponse.json(updatedProductCatalog);
    } catch (error: unknown) {
        console.error("PUT /api/product-catalog/:id error:", error);
        return NextResponse.json(
            { error: "Failed to update product catalog", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// DELETE: Delete a product catalog by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "Product catalog ID is required" }, { status: 400 });
        }

        await prisma.productCatalog.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Product catalog deleted successfully" });
    } catch (error: unknown) {
        console.error("DELETE /api/product-catalog/:id error:", error);

        return NextResponse.json(
            { error: "Failed to delete product catalog", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
