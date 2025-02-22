import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // ✅ Use the shared Prisma instance

// ✅ POST - Create a new shop
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, vendorId } = body;

    // 🔴 Validate required fields
    if (!name || !vendorId) {
      return NextResponse.json({ error: "Shop name and vendorId are required" }, { status: 400 });
    }

    // ✅ Create shop in database
    const newShop = await prisma.shop.create({
      data: {
        name,
        description: description || "", // Default to empty string if missing
        status: "active",
        vendorId, // Direct assignment (no need for `connect`)
      },
    });

    return NextResponse.json(newShop, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating shop:", error);
    return NextResponse.json({ error: "Failed to create shop", details: error.message }, { status: 500 });
  }
}

// ✅ GET - Fetch all shops
export async function GET() {
  try {
    const shops = await prisma.shop.findMany({
      include: { vendor: true, products: true, orders: true }, // Include related data
    });

    return NextResponse.json(shops, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching shops:", error);
    return NextResponse.json({ error: "Failed to fetch shops", details: error.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove a shop (by ID)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("id");

    if (!shopId) {
      return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
    }

    await prisma.shop.delete({ where: { id: shopId } });

    return NextResponse.json({ message: "Shop deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error deleting shop:", error);
    return NextResponse.json({ error: "Failed to delete shop", details: error.message }, { status: 500 });
  }
}
