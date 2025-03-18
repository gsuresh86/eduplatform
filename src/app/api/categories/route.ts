import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });
    
    // Transform the data to match the expected format
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      count: category._count.courses,
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
} 