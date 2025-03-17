import { ClientCourseCard } from "@/components/client-course-card";
import { db } from "@/lib/db";

// Fetch courses from the database
async function getCourses() {
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
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
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
    
    return [
      { id: "all", name: "All Categories" },
      ...categories.map(category => ({
        id: category.id,
        name: category.name,
        count: category._count.courses,
      })),
    ];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [{ id: "all", name: "All Categories" }];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Courses</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            {/* Categories Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Price Range</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="price-free"
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="price-free" className="ml-2 text-gray-700">
                    Free
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="price-under-50"
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="price-under-50" className="ml-2 text-gray-700">
                    Under $50
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="price-50-100"
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="price-50-100" className="ml-2 text-gray-700">
                    $50 - $100
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="price-over-100"
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="price-over-100" className="ml-2 text-gray-700">
                    Over $100
                  </label>
                </div>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            <button className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
              Clear Filters
            </button>
          </div>
        </div>
        
        {/* Courses Grid */}
        <div className="md:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <span className="text-gray-600">Showing {courses.length} courses</span>
            </div>
            <div>
              <select className="p-2 border border-gray-300 rounded-md">
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
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
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
                Previous
              </button>
              <button className="px-3 py-1 rounded-md bg-blue-600 text-white">
                1
              </button>
              <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
                2
              </button>
              <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
                3
              </button>
              <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 