import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

// GET: Fetch products for a specific shop (shopId as query parameter)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const shopId = searchParams.get("shopId")

    if (!shopId) {
      return NextResponse.json({ error: "Missing shopId query parameter" }, { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: { shopId: shopId },
      include: { catalog: true }, // Include ProductCatalog details
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("GET /api/products error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

// POST: Create a new product for a shop
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { shopId, products } = body

    if (!shopId || !products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Ensure shop exists
    const existingShop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { id: true },
    })

    if (!existingShop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 })
    }

    // Create products in bulk
    const createdProducts = await Promise.all(
      products.map(async ({ productId, price, stock, image }) => {
        // Check if product already exists in the shop
        const existingProduct = await prisma.product.findFirst({
          where: { shopId, catalogId: productId },
          select: { id: true },
        })

        if (existingProduct) {
          return {
            status: "skipped",
            message: `Product ${productId} already exists in this shop`,
            productId,
          }
        }

        // Create product
        const newProduct = await prisma.product.create({
          data: {
            shopId,
            catalogId: productId,
            price,
            stock,
          },
          include: { catalog: true },
        })

        return { status: "created", product: newProduct }
      }),
    )

    return NextResponse.json(
      {
        message: "Products processed",
        results: createdProducts,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/products error:", error)
    return NextResponse.json(
      { error: "Failed to create products", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

