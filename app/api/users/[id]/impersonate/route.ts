import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";

// POST: Admin impersonates a user
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const Resolvedparams = await params;
        const userId = Resolvedparams.id;

        // Get the current session to verify admin status
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
        }

        // Store the admin's ID
        const adminId = session.user.id;

        // Fetch the user to impersonate
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get the cookies object
        const cookieStore =await cookies();

        // Store original admin session in cookies
        cookieStore.set("originalAdminId", adminId, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        // Set a new session as the impersonated user
        cookieStore.set("sessionUserId", user.id, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        // Set a flag to indicate impersonation mode
        cookieStore.set("impersonating", "true", { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return NextResponse.json({ 
            message: "Impersonation started", 
            impersonating: user,
            success: true
        });
    } catch (error) {
        console.error("Impersonation error:", error);
        return NextResponse.json({ error: "Failed to impersonate user", details: error }, { status: 500 });
    }
}

// DELETE: Stop impersonation and switch back to admin
export async function DELETE() {
    try {
        // Get the cookies object
        const cookieStore =await cookies();

        const originalAdminId = cookieStore.get("originalAdminId")?.value;

        if (!originalAdminId) {
            return NextResponse.json({ error: "No impersonation session found" }, { status: 400 });
        }

        // Restore admin session
        cookieStore.set("sessionUserId", originalAdminId, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        // Remove impersonation cookies
        cookieStore.delete("originalAdminId");
        cookieStore.delete("impersonating");

        return NextResponse.json({ message: "Impersonation ended. Switched back to admin." });
    } catch (error) {
        console.error("End impersonation error:", error);
        return NextResponse.json({ error: "Failed to stop impersonation", details: error }, { status: 500 });
    }
}