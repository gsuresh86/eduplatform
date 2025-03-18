"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/providers/cart-provider";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cartCount } = useCart();

  const isActive = (path: string) => {
    return pathname === path ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                EduPlatform
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`inline-flex items-center px-1 pt-1 border-b-2 ${isActive('/') ? 'border-blue-500' : 'border-transparent'} ${isActive('/')}`}>
                Home
              </Link>
              <Link href="/courses" className={`inline-flex items-center px-1 pt-1 border-b-2 ${isActive('/courses') ? 'border-blue-500' : 'border-transparent'} ${isActive('/courses')}`}>
                Courses
              </Link>
              {session?.user?.role === "INSTRUCTOR" && (
                <Link href="/instructor/courses" className={`inline-flex items-center px-1 pt-1 border-b-2 ${isActive('/instructor/courses') ? 'border-blue-500' : 'border-transparent'} ${isActive('/instructor/courses')}`}>
                  My Courses
                </Link>
              )}
              {session?.user?.role === "ADMIN" && (
                <Link href="/admin/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 ${isActive('/admin/dashboard') ? 'border-blue-500' : 'border-transparent'} ${isActive('/admin/dashboard')}`}>
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link href="/dashboard" className={`px-3 py-2 rounded-md ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 rounded-md text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className={`px-3 py-2 rounded-md ${isActive('/login')}`}>
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 