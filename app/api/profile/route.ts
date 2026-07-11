import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
      select: {
        id: true,
        email: true,
        fullName: true,
        nickname: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fullName, nickname, image } = await request.json();

    const user = await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: {
        fullName: fullName || undefined,
        nickname: nickname !== undefined && nickname !== "" ? nickname : null,
        image: image !== undefined ? image : undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        nickname: true,
        image: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
