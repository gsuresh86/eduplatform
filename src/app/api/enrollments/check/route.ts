import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { isEnrolled: false },
        { status: 200 }
      );
    }

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
          userId: session.user.id,
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