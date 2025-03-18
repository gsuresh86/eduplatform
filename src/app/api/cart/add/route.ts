import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/nextauth/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Ensure session and user exist and have an id property
    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json(
        { error: "You must be logged in to add items to your cart" },
        { status: 401 }
      );
    }

    // Type assertion for session.user to include id
    const userId = (session.user as { id: string }).id;

    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if the course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if the user is already enrolled in the course
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId,
        },
      },
    });

    if (enrollment) {
      return NextResponse.json(
        { error: "You are already enrolled in this course" },
        { status: 400 }
      );
    }

    // Check if the item is already in the cart
    const existingCartItem = await db.cartItem.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId,
        },
      },
    });

    if (existingCartItem) {
      return NextResponse.json(
        { message: "Item is already in your cart" },
        { status: 200 }
      );
    }

    // Add the item to the cart in the database
    const cartItem = await db.cartItem.create({
      data: {
        userId: userId,
        courseId,
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the item to your cart" },
      { status: 500 }
    );
  }
} 