"use client";

import { useState, useEffect } from "react";
import { CourseCard } from "./course-card";
import { useCart } from "@/providers/cart-provider";
import { useSession } from "next-auth/react";

interface ClientCourseCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  authorName?: string;
}

export function ClientCourseCard(props: ClientCourseCardProps) {
  const { addToCart, isLoading } = useCart();
  const { data: session } = useSession();
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    // Check if the user is enrolled in this course
    if (session?.user?.id) {
      const checkEnrollment = async () => {
        try {
          const response = await fetch(`/api/enrollments/check?courseId=${props.id}`);
          if (response.ok) {
            const data = await response.json();
            setIsEnrolled(data.isEnrolled);
          }
        } catch (error) {
          console.error("Error checking enrollment:", error);
        }
      };
      
      checkEnrollment();
    }
  }, [session, props.id]);

  const handleAddToCart = async (courseId: string) => {
    await addToCart(courseId);
  };

  return (
    <CourseCard 
      {...props} 
      onAddToCart={handleAddToCart}
      isLoading={isLoading}
      isEnrolled={isEnrolled}
    />
  );
} 