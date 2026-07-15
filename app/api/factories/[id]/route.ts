import { NextRequest, NextResponse } from "next/server";
import { getFactoryById, updateFactory } from "@/lib/factories";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const factory = await getFactoryById(parseInt(id));

    if (!factory) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Non-approved factories are only visible to their owner
    if (factory.status !== "approved") {
      const session = await auth();
      const userId = session?.user?.id ? parseInt(session.user.id) : null;

      if (!userId || factory.userId !== userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ data: factory });
  } catch (error) {
    console.error("Error getting factory:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { id } = await params;
    const factoryId = parseInt(id);
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Factory name is required" },
        { status: 400 }
      );
    }

    const factory = await updateFactory(factoryId, userId, {
      name: body.name,
      regNumber: body.regNumber,
      operator: body.operator,
      businessActivity: body.businessActivity,
      houseNumber: body.houseNumber,
      village: body.village,
      soi: body.soi,
      road: body.road,
      subdistrict: body.subdistrict,
      district: body.district,
      province: body.province,
      postalCode: body.postalCode,
      phone: body.phone,
      type: body.type,
      workers: body.workers,
      country: body.country,
      image: body.image,
    });

    return NextResponse.json(factory);
  } catch (error) {
    console.error("Error updating factory:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Factory not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
