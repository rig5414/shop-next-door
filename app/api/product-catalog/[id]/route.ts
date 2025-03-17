import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// GET: Fetch a single product catalog by ID
export async function GET(
    request: NextRequest,
    context: { params: { id: string } } // Original type
) {
    const { params } = context as { params: { id: string } }; // Type assertion here
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "Product catalog ID is required" }, { status: 400 });
    }

    try {
        const productCatalog = await prisma.productCatalog.findUniqueOrThrow({
            where: { id },
        });

        return NextResponse.json({
            ...productCatalog,
            image: productCatalog.image ? `${productCatalog.image}` : "/placeholder-product.jpg",
        });
    } catch (error) {
        console.error("GET /api/product-catalog/:id error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Product catalog not found" }, { status: 404 });
    }
}


// PUT: Update a product catalog by ID
export async function PUT(
    request: NextRequest,
    context: { params: { id: string } } // Original type
) {
    try {
        const { params } = context as { params: { id: string } }; // Type assertion here
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "Product catalog ID is required" }, { status: 400 });
        }

        const body = await request.json();
        const { name, description, defaultPrice, image, category } = body;

        if (!name && !description && defaultPrice == null && image === undefined && !category) {
            return NextResponse.json({ error: "At least one field must be provided to update" }, { status: 400 });
        }

        const updateData: Record<string, unknown> = {}; // More explicit type
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (defaultPrice != null) updateData.defaultPrice = defaultPrice;
        if (image) updateData.image = image.substring(image.lastIndexOf('/') + 1);
        if (category) updateData.category = category;

        const updatedProductCatalog = await prisma.productCatalog.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            ...updatedProductCatalog,
            image: `/images/${updatedProductCatalog.image}`
        });
    } catch (error) {
        console.error("PUT /api/product-catalog/:id error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Failed to update product catalog" }, { status: 500 });
    }
}


// DELETE: Delete a product catalog by ID
export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } } // Original type
) {
    try {
        const { params } = context as { params: { id: string } }; // Type assertion here
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "Product catalog ID is required" }, { status: 400 });
        }

        await prisma.productCatalog.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Product catalog deleted successfully" });
    } catch (error) {
        console.error("DELETE /api/product-catalog/:id error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Failed to delete product catalog" }, { status: 500 });
    }
}
