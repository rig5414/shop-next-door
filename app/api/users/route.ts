import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: Fetch all users (TEMP: No auth check)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users", details: error }, { status: 500 });
  }
}

// POST: Create a new user (TEMP: No auth check)
export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: { name, email,password, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user", details: error }, { status: 500 });
  }
}