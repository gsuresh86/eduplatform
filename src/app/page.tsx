import Link from "next/link";
import Image from "next/image";
import { ClientCourseCard } from "@/components/client-course-card";
import { db } from "@/lib/db";

// Fetch featured courses from the database
async function getFeaturedCourses() {
  try {
    const courses = await db.course.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return courses;
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    return [];
  }
}

// Fetch categories from the database
async function getCategories() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });
    
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      count: category._count.courses,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Home() {
  const featuredCourses = await getFeaturedCourses();
  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Expand Your Knowledge with EduPlatform
              </h1>
              <p className="text-xl mb-8">
                Access high-quality courses taught by industry experts and take your skills to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/courses"
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition"
                >
                  Browse Courses
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white/10 transition"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-80">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Students learning"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
            <Link
              href="/courses"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <ClientCourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                price={course.price}
                imageUrl={course.imageUrl || undefined}
                authorName={course.author?.name || undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/courses?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
              >
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-500">{category.count} courses</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">Web Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The courses on EduPlatform have been instrumental in advancing my career. The instructors are knowledgeable and the content is up-to-date with industry standards."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-500 text-sm">Data Scientist</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've taken several data science courses on this platform, and they've all been excellent. The hands-on projects really helped me apply what I learned."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  L
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Lisa Rodriguez</h4>
                  <p className="text-gray-500 text-sm">UX Designer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The UI/UX design courses here are top-notch. I was able to build a portfolio of projects that helped me land my dream job."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
