import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// GET: Fetch a single user by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user", details: error }, { status: 500 });
  }
}

// PUT: Update user details
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { name, email },
      select: { id: true, name: true, email: true }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user", details: error }, { status: 500 });
  }
}

// DELETE: Delete a user (TEMP: No auth check)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    // Delete order items linked to the user's orders
    await prisma.orderItem.deleteMany({
      where: { order: { customerId: userId } }
    });

    // Delete transactions linked to the user
    await prisma.transaction.deleteMany({
      where: { customerId: userId }
    });

    // Delete orders linked to the user
    await prisma.order.deleteMany({
      where: { customerId: userId }
    });

    // Delete products from shops owned by the user
    await prisma.product.deleteMany({
      where: { shop: { vendorId: userId } }
    });

    // Delete shops owned by the user
    await prisma.shop.deleteMany({
      where: { vendorId: userId }
    });

    // Now delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user", details: error }, { status: 500 });
  }
}
