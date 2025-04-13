import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// GET: Fetch a single product by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                catalog: true, // Include the ProductCatalog details
            },
        });
    
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

          // Transform the product to include image directly
          const transformedProduct = {
            ...product,
            image: product.catalog?.image,
        };

        return NextResponse.json(transformedProduct);
    } catch (error: unknown) {
        console.error("GET /api/products/:id error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// PUT: Update a product by ID
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { price, stock } = await request.json();
        const id = await params.id;  // Await the params

        const updatedProduct = await prisma.product.update({
            where: { id },  // Use awaited id
            data: { price, stock },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// DELETE: Delete a product by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const existingProduct = await prisma.product.findUnique({ where: { id: params.id } });

        if (!existingProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Delete related OrderItem records first to prevent foreign key constraints
        await prisma.orderItem.deleteMany({
            where: { productId: params.id },
        });

        // Delete the product
        await prisma.product.delete({ where: { id: params.id } });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: unknown) {
        console.error("DELETE /api/products/:id error:", error);
        return NextResponse.json(
            { error: "Failed to delete product", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
