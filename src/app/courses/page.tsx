import { Suspense } from "react";
import CoursesClient from "./courses-client";

interface PageProps {
  searchParams?: {
    category?: string;
    price?: string;
    level?: string;
    page?: string;
    sort?: string;
  };
}

// Server component that wraps the client component
export default function CoursesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CoursesClient searchParams={searchParams} />
    </Suspense>
  );
} 