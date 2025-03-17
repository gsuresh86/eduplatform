import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, PlayCircleIcon, ClockIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { ClientCourseActions } from "@/components/client-course-actions";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

// Fetch course by ID from the database
async function getCourseById(id: string) {
  try {
    const course = await db.course.findUnique({
      where: {
        id,
        published: true,
      },
      include: {
        author: true,
        lessons: {
          orderBy: {
            position: 'asc',
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });
    
    if (!course) {
      return null;
    }
    
    // Group lessons by section (for this example, we'll create sections based on every 3 lessons)
    const lessonGroups = [];
    const sectionSize = 3;
    
    for (let i = 0; i < course.lessons.length; i += sectionSize) {
      const sectionLessons = course.lessons.slice(i, i + sectionSize);
      const sectionTitle = `Section ${Math.floor(i / sectionSize) + 1}`;
      
      lessonGroups.push({
        title: sectionTitle,
        lessons: sectionLessons.map(lesson => ({
          title: lesson.title,
          duration: "15:00", // Placeholder duration since it's not in the schema
        })),
      });
    }
    
    return {
      ...course,
      curriculum: lessonGroups,
      level: "Intermediate", // Placeholder since it's not in the schema
      duration: `${course.lessons.length * 15} minutes`, // Estimate based on lessons
      students: course._count.enrollments,
      rating: 4.5, // Placeholder since it's not in the schema
      reviews: 0, // Placeholder since it's not in the schema
      category: course.categories[0]?.category.name || "Uncategorized",
      longDescription: course.description,
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourseById(params.id);
  
  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="relative h-96 w-full">
          <Image
            src={course.imageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee"}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
            <div className="max-w-3xl mx-auto px-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-blue-600 bg-opacity-80 px-3 py-1 rounded-full text-sm">
                  {course.category}
                </span>
                <span className="bg-gray-700 bg-opacity-80 px-3 py-1 rounded-full text-sm">
                  {course.level}
                </span>
                <span className="bg-gray-700 bg-opacity-80 px-3 py-1 rounded-full text-sm flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {course.duration}
                </span>
                <span className="bg-gray-700 bg-opacity-80 px-3 py-1 rounded-full text-sm flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  {course.lessons.length} lessons
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{course.rating}</span>
                  <span className="ml-1 text-gray-300">({course.reviews} reviews)</span>
                </div>
                <div>
                  <span>{course.students} students enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Course Content */}
        <div className="lg:w-2/3">
          {/* About This Course */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
            <div className="prose max-w-none">
              {course.longDescription.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
            <div className="space-y-4">
              {course.curriculum.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-4 font-semibold">
                    {section.title}
                  </div>
                  <div className="divide-y divide-gray-200">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <PlayCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span>{lesson.title}</span>
                        </div>
                        <span className="text-gray-500 text-sm">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Your Instructor</h2>
            <div className="flex items-start">
              <div className="relative h-20 w-20 rounded-full overflow-hidden mr-4">
                <Image
                  src={course.author.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330"}
                  alt={course.author.name || "Instructor"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{course.author.name}</h3>
                <p className="text-gray-600 mt-2">
                  {course.author.role === "INSTRUCTOR" ? "Instructor" : "Author"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="text-3xl font-bold mb-4">${course.price.toFixed(2)}</div>
            <ClientCourseActions courseId={course.id} />
            <div className="mt-6">
              <h3 className="font-semibold mb-2">This course includes:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                  {course.duration} of on-demand video
                </li>
                <li className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
                  {course.lessons.length} lessons
                </li>
                <li>Full lifetime access</li>
                <li>Access on mobile and TV</li>
                <li>Certificate of completion</li>
              </ul>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 