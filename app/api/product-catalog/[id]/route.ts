import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// GET: Fetch a single product catalog by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const productCatalog = await prisma.productCatalog.findUnique({
            where: { id: params.id },
        });

        if (!productCatalog) {
            return NextResponse.json({ error: "Product catalog not found" }, { status: 404 });
        }

        return NextResponse.json(productCatalog);
    } catch (error) {
        console.error("GET /api/product-catalogs/:id error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product catalog", details: error },
            { status: 500 }
        );
    }
}

// PUT: Update a product catalog by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { name, description, defaultPrice, image, category } = body;

        const existingProductCatalog = await prisma.productCatalog.findUnique({
            where: { id: params.id },
        });

        if (!existingProductCatalog) {
            return NextResponse.json({ error: "Product catalog not found" }, { status: 404 });
        }

        const updatedProductCatalog = await prisma.productCatalog.update({
            where: { id: params.id },
            data: { name, description, defaultPrice, image, category },
        });

        return NextResponse.json(updatedProductCatalog);
    } catch (error) {
        console.error("PUT /api/product-catalogs/:id error:", error);
        return NextResponse.json(
            { error: "Failed to update product catalog", details: error },
            { status: 500 }
        );
    }
}

// DELETE: Delete a product catalog by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const existingProductCatalog = await prisma.productCatalog.findUnique({
            where: { id: params.id },
        });

        if (!existingProductCatalog) {
            return NextResponse.json({ error: "Product catalog not found" }, { status: 404 });
        }

        await prisma.productCatalog.delete({ where: { id: params.id } });

        return NextResponse.json({ message: "Product catalog deleted successfully" });
    } catch (error) {
        console.error("DELETE /api/product-catalogs/:id error:", error);
        return NextResponse.json(
            { error: "Failed to delete product catalog", details: error },
            { status: 500 }
        );
    }
}