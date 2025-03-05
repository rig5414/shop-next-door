import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

// GET: Fetch a single user by ID
export async function GET(req: Request, context: { params: { id: string } }) {
  const { params } = context;
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
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const { name, email } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
      select: { id: true, name: true, email: true }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user", details: error }, { status: 500 });
  }
}

// PATCH: Change user password
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = params.id;
    const { currentPassword, newPassword } = await req.json();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the user can only change their own password (unless admin)
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If admin, skip password check
    if (session.user.role !== "admin") {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update password", details: error }, { status: 500 });
  }
}

// DELETE: Delete a user (TEMP: No auth check)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const session = await getServerSession(authOptions);

    console.log("Session:", session);
    console.log("Request User ID:", userId);
    console.log("Session User ID:", session?.user?.id);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized, please contact your Administrator" }, { status: 401 });
    }

    const requestBody = await req.json().catch(() => ({})); // Handle cases with no body
    const { password } = requestBody;

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure the logged-in user can only delete their own account (unless admin)
    if (session.user.role !== "admin" && session.user.id !== userId) {
      console.log("Session:", session);
      console.log("Headers:", headers());
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // If admin, skip password check
    if (session.user.role === "admin") {
      await deleteUser(userId);
      return NextResponse.json({ message: "User deleted successfully (by admin)" });
    }

    // Ensure password is provided before checking
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required to delete account" }, { status: 400 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Proceed with account deletion
    await deleteUser(userId);
    return NextResponse.json({ message: "User deleted successfully" });

  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user", details: error }, { status: 500 });
  }
}

// Helper function to delete user and related data
async function deleteUser(userId: string) {
  await prisma.orderItem.deleteMany({ where: { order: { customerId: userId } } });
  await prisma.transaction.deleteMany({ where: { customerId: userId } });
  await prisma.order.deleteMany({ where: { customerId: userId } });
  await prisma.product.deleteMany({ where: { shop: { vendorId: userId } } });
  await prisma.shop.deleteMany({ where: { vendorId: userId } });
  await prisma.user.delete({ where: { id: userId } });
}
