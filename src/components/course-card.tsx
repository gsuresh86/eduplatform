"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  authorName?: string;
  isLoading?: boolean;
  isEnrolled?: boolean;
  onAddToCart?: (courseId: string) => void;
}

export function CourseCard({
  id,
  title,
  description,
  price,
  imageUrl,
  authorName,
  isLoading = false,
  isEnrolled = false,
  onAddToCart,
}: CourseCardProps) {
  const { data: session } = useSession();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        {authorName && (
          <p className="text-sm text-gray-500 mb-2">Instructor: {authorName}</p>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          {isEnrolled ? (
            <Link
              href={`/courses/${id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Continue Learning
            </Link>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleAddToCart}
                className="p-2 text-blue-600 hover:text-blue-800 transition"
                aria-label="Add to cart"
                disabled={isLoading}
              >
                <ShoppingCartIcon className={`h-6 w-6 ${isLoading ? 'opacity-50' : ''}`} />
              </button>
              <Link
                href={`/courses/${id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 