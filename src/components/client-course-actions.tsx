"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/providers/cart-provider";
import { useSession } from "next-auth/react";

interface ClientCourseActionsProps {
  courseId: string;
}

export function ClientCourseActions({ courseId }: ClientCourseActionsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToCart, isLoading } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }

    setIsAddingToCart(true);
    await addToCart(courseId);
    setIsAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }

    setIsBuyingNow(true);
    await addToCart(courseId);
    router.push("/cart");
    setIsBuyingNow(false);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart || isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isAddingToCart ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Adding...
          </>
        ) : (
          <>
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            Add to Cart
          </>
        )}
      </button>
      <button
        onClick={handleBuyNow}
        disabled={isBuyingNow || isLoading}
        className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isBuyingNow ? (
          <>
            <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
            Processing...
          </>
        ) : (
          "Buy Now"
        )}
      </button>
    </div>
  );
} 