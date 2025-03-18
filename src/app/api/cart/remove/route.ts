import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/nextauth/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to remove items from your cart" },
        { status: 401 }
      );
    }

    const { cartItemId } = await req.json();

    if (!cartItemId) {
      return NextResponse.json(
        { error: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // Check if the cart item exists and belongs to the user
    const cartItem = await db.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Remove the item from the cart
    await db.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return NextResponse.json(
      { message: "Item removed from cart successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "An error occurred while removing the item from your cart" },
      { status: 500 }
    );
  }
} 