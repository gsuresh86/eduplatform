"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

// Create a separate client component that uses useSearchParams
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id") || null;
  const orderId = searchParams?.get("order_id") || null;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !orderId) {
      setError("Invalid checkout session");
      setIsLoading(false);
      return;
    }

    // In a real application, you could verify the order status here
    // For simplicity, we'll just simulate loading for a moment
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId, orderId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Processing your order...</h1>
        <p className="text-gray-600">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link
          href="/courses"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-8">
          <CheckCircleIcon className="h-24 w-24 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
        <p className="text-xl text-gray-700 mb-6">
          Your order has been successfully processed.
        </p>
        <p className="text-gray-600 mb-8">
          Order ID: <span className="font-medium">{orderId}</span>
        </p>
        <p className="text-gray-600 mb-12">
          You'll receive a confirmation email with your order details shortly.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/courses"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Browse More Courses
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Go to My Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

// Create a loading fallback component
function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      <p className="text-gray-600">Please wait while we load your order information.</p>
    </div>
  );
}

// Main page component that uses Suspense
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 