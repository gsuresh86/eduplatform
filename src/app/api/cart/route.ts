import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/nextauth/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Ensure session and user exist and have an id property
    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json(
        { error: "You must be logged in to view your cart" },
        { status: 401 }
      );
    }

    // Type assertion for session.user to include id
    const userId = (session.user as { id: string }).id;

    // Get the user's cart items with course details from the database
    const cartItems = await db.cartItem.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            imageUrl: true,
            author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        addedAt: "desc",
      },
    });
    
    // Calculate the total price
    const total = cartItems.reduce((sum, item) => sum + item.course.price, 0);
    const count = cartItems.length;

    return NextResponse.json({
      items: cartItems,
      total,
      count,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching your cart items" },
      { status: 500 }
    );
  }
} 