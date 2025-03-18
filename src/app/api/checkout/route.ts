import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/nextauth/options";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    // Ensure session and user exist and have an id property
    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json(
        { error: "You must be logged in to checkout" },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    // Get the user's cart items with course details
    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty" },
        { status: 400 }
      );
    }

    // Initialize Stripe with the secret key from env
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-06-20" as any, // Using newer API version
    });

    // Create a new order in the database
    const order = await db.order.create({
      data: {
        userId,
        amount: cartItems.reduce((sum: number, item: any) => sum + item.course.price, 0),
        status: "PENDING",
        orderItems: {
          create: cartItems.map((item: any) => ({
            courseId: item.course.id,
            price: item.course.price,
          })),
        },
      },
    });

    // Create line items for Stripe checkout
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.course.title,
          description: item.course.description.substring(0, 255),
          images: item.course.imageUrl ? [item.course.imageUrl] : [],
        },
        unit_amount: Math.round(item.course.price * 100), // Stripe requires amounts in cents
      },
      quantity: 1,
    }));

    // Create a Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      metadata: {
        orderId: order.id,
        userId,
      },
    });

    // Update the order with the payment intent ID
    if (checkoutSession.payment_intent) {
      await db.order.update({
        where: { id: order.id },
        data: { paymentIntentId: checkoutSession.payment_intent.toString() },
      });
    }

    // Return the checkout URL
    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
} 