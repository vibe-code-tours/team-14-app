import { prisma } from "./prisma";

export interface CreateSuggestionInput {
  name: string;
  type: "factory" | "agency";
  country: string;
  city?: string;
}

export async function createSuggestion(input: CreateSuggestionInput) {
  if (!input.name?.trim() || !input.country?.trim()) {
    throw new Error("Name and country are required");
  }

  if (!["factory", "agency"].includes(input.type)) {
    throw new Error("Invalid type");
  }

  return prisma.suggestedOrganization.create({
    data: {
      name: input.name.trim(),
      type: input.type,
      country: input.country.trim(),
      city: input.city?.trim() || null,
    },
    select: {
      id: true,
      status: true,
    },
  });
}

export async function searchOrganizations(params: {
  search?: string;
  country?: string;
}) {
  const { search, country } = params;

  const where: Record<string, unknown> = {
    status: "approved",
  };

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (country) {
    where.country = country;
  }

  return prisma.suggestedOrganization.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      type: true,
      country: true,
      city: true,
      createdAt: true,
    },
  });
}

// Admin functions

export async function getPendingSuggestions(status?: string) {
  const where: Record<string, unknown> = {};

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    where.status = status;
  }

  return prisma.suggestedOrganization.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateSuggestionStatus(id: number, status: "approved" | "rejected") {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const result = await prisma.suggestedOrganization.update({
    where: { id },
    data: { status, updatedAt: new Date() },
    select: {
      id: true,
      status: true,
    },
  });

  return result;
}
