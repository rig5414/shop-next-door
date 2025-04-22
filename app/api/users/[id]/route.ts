import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

// GET: Fetch a single user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id; // Remove await here
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user", details: error }, { status: 500 });
  }
}

// PUT: Update user details
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();
    const allowedUpdates: any = {};

    // Handle name update directly
    if (updates.name) {
      allowedUpdates.name = updates.name;
    }

    // Handle email update
    if (updates.email) {
      allowedUpdates.email = updates.email;
    }

    // Handle role update (only if admin)
    if (updates.role && session.user.role === 'admin') {
      allowedUpdates.role = updates.role;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: allowedUpdates,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// PATCH: Change user password
export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = context.params.id;
    const { currentPassword, newPassword } = await req.json();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure users can only change their own password unless admin
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate passwords
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new passwords are required" }, { status: 400 });
    }

    // Check password strength
    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters and include a number & special symbol." },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check current password before updating
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
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
    console.error("Error updating password:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
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
