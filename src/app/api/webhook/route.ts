import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Stripe from "stripe";

// Disable the Next.js bodyParser to get the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextRequest): Promise<string> {
  const reader = req.body?.getReader();
  if (!reader) {
    return '';
  }

  const chunks = [];
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      chunks.push(value);
    }
  }

  const concatenated = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  );
  
  let position = 0;
  for (const chunk of chunks) {
    concatenated.set(chunk, position);
    position += chunk.length;
  }

  return new TextDecoder().decode(concatenated);
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers.get('stripe-signature') as string;
    
    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-06-20" as any, // Using newer API version
    });

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update order status to PAID
      if (session.metadata?.orderId) {
        await db.order.update({
          where: { id: session.metadata.orderId },
          data: { status: "PAID" },
        });

        // Create enrollments for all courses in the order
        const orderItems = await db.orderItem.findMany({
          where: { orderId: session.metadata.orderId },
          select: { courseId: true },
        });

        // Create enrollments for each course in the order
        if (session.metadata.userId) {
          for (const item of orderItems) {
            // Check if enrollment already exists
            const existingEnrollment = await db.enrollment.findUnique({
              where: {
                userId_courseId: {
                  userId: session.metadata.userId,
                  courseId: item.courseId,
                },
              },
            });

            // Only create enrollment if it doesn't exist
            if (!existingEnrollment) {
              await db.enrollment.create({
                data: {
                  userId: session.metadata.userId,
                  courseId: item.courseId,
                },
              });
            }
          }

          // Clear the user's cart after successful payment
          await db.cartItem.deleteMany({
            where: { userId: session.metadata.userId },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
} 