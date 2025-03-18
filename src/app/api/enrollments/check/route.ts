import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/nextauth/options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Ensure session and user exist and have an id property
    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json(
        { isEnrolled: false },
        { status: 200 }
      );
    }

    // Type assertion for session.user to include id
    const userId = (session.user as { id: string }).id;

    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if the user is enrolled in the course
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId,
        },
      },
    });

    return NextResponse.json(
      { isEnrolled: !!enrollment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return NextResponse.json(
      { error: "An error occurred while checking enrollment" },
      { status: 500 }
    );
  }
} 