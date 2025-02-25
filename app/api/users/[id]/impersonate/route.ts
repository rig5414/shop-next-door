import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { cookies } from "next/headers";

// POST: Admin impersonates a user
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;

        // Mocking auth check (Replace this with real authentication logic)
        const adminUser = { id: "mockAdminId", role: "admin" };

        if (adminUser.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Fetch the user to impersonate
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get the cookies object
        const cookieStore = await cookies();

        // Store original admin session in cookies
        cookieStore.set("originalAdminId", adminUser.id, { httpOnly: true, secure: true });

        // Set a new session as the impersonated user
        cookieStore.set("sessionUserId", user.id, { httpOnly: true, secure: true });

        return NextResponse.json({ message: "Impersonation started", impersonating: user });
    } catch (error) {
        return NextResponse.json({ error: "Failed to impersonate user", details: error }, { status: 500 });
    }
}

// DELETE: Stop impersonation and switch back to admin
export async function DELETE() {
    try {
        // Get the cookies object
        const cookieStore = await cookies();

        const originalAdminId = cookieStore.get("originalAdminId")?.value;

        if (!originalAdminId) {
            return NextResponse.json({ error: "No impersonation session found" }, { status: 400 });
        }

        // Restore admin session
        cookieStore.set("sessionUserId", originalAdminId, { httpOnly: true, secure: true });

        // Remove impersonation cookie
        cookieStore.delete("originalAdminId");

        return NextResponse.json({ message: "Impersonation ended. Switched back to admin." });
    } catch (error) {
        return NextResponse.json({ error: "Failed to stop impersonation", details: error }, { status: 500 });
    }
}