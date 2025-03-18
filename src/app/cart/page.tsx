"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/providers/cart-provider";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartItems, cartTotal, isLoading, removeFromCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/cart");
    }
  }, [status, router]);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to proceed to checkout");
      setIsCheckingOut(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <Link
            href="/courses"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 sm:h-24 relative mb-4 sm:mb-0 sm:mr-6">
                      {item.course.imageUrl ? (
                        <Image
                          src={item.course.imageUrl}
                          alt={item.course.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            <Link href={`/courses/${item.course.id}`} className="hover:text-blue-600">
                              {item.course.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {item.course.description}
                          </p>
                          {item.course.author?.name && (
                            <p className="text-sm text-gray-500">
                              Instructor: {item.course.author.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${item.course.price.toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="mt-2 text-red-600 hover:text-red-800 flex items-center text-sm"
                            disabled={isCheckingOut}
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
                isCheckingOut ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isCheckingOut ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Processing...
                </span>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
            <Link
              href="/courses"
              className={`w-full block text-center mt-4 py-3 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition ${
                isCheckingOut ? 'opacity-70 pointer-events-none' : ''
              }`}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 