import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// DELETE: End impersonation from any page
export async function DELETE() {
    try {
        // Get the cookies object
        const cookieStore = await cookies();

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