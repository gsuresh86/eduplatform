"use client";

import { useState, useEffect } from "react";
import { ClientCourseCard } from "@/components/client-course-card";
import { useRouter } from "next/navigation";

// Define interfaces for our data types
interface Category {
  id: string;
  name: string;
  count?: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  published: boolean;
  author?: {
    name?: string | null;
  } | null;
  categories?: {
    category: Category;
  }[];
}

interface CoursesClientProps {
  searchParams?: {
    category?: string;
    price?: string;
    level?: string;
    page?: string;
    sort?: string;
  };
}

export default function CoursesClient({ searchParams }: CoursesClientProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [level, setLevel] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const coursesPerPage = 6;

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses
        const coursesRes = await fetch('/api/courses');
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
        
        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories([
          { id: "all", name: "All Categories" },
          ...categoriesData
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process URL search params on initial load
  useEffect(() => {
    if (searchParams) {
      // Handle category filter from URL
      if (searchParams.category && searchParams.category !== "all") {
        setSelectedCategories(searchParams.category.split(','));
      }

      // Handle price filter from URL
      if (searchParams.price) {
        setPriceRange(searchParams.price.split(','));
      }

      // Handle level filter from URL
      if (searchParams.level) {
        setLevel(searchParams.level.split(','));
      }

      // Handle pagination
      if (searchParams.page) {
        setCurrentPage(parseInt(searchParams.page) || 1);
      }

      // Handle sorting
      if (searchParams.sort) {
        setSortBy(searchParams.sort);
      }
    }
  }, [searchParams]);

  // Apply filters and sorting whenever filters or courses change
  useEffect(() => {
    if (courses.length === 0) return;

    let filtered = [...courses];

    // Apply category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes("all")) {
      filtered = filtered.filter(course => 
        course.categories?.some(cat => selectedCategories.includes(cat.category.id))
      );
    }

    // Apply price filter
    if (priceRange.length > 0) {
      if (priceRange.includes("free")) {
        filtered = filtered.filter(course => course.price === 0);
      } else if (priceRange.includes("paid")) {
        filtered = filtered.filter(course => course.price > 0);
      }
    }

    // Apply level filter
    // Note: Since level isn't in the database schema, this is just a placeholder
    // You would need to add this field to the courses or create a mapping
    if (level.length > 0) {
      // This is a placeholder implementation
      // In a real application, you would filter based on actual level data
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        // Assuming courses are already sorted by creation date from the API
        break;
    }

    setFilteredCourses(filtered);
  }, [courses, selectedCategories, priceRange, level, sortBy]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategories.length > 0 && !selectedCategories.includes("all")) {
      params.set("category", selectedCategories.join(','));
    }
    
    if (priceRange.length > 0) {
      params.set("price", priceRange.join(','));
    }
    
    if (level.length > 0) {
      params.set("level", level.join(','));
    }
    
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }
    
    if (sortBy !== "newest") {
      params.set("sort", sortBy);
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedCategories, priceRange, level, currentPage, sortBy]);

  // Handle category filter change
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      setSelectedCategories(["all"]);
    } else {
      setSelectedCategories(prev => {
        // If "all" is selected, remove it
        const filtered = prev.filter(id => id !== "all");
        
        // Toggle the selected category
        if (filtered.includes(categoryId)) {
          return filtered.filter(id => id !== categoryId);
        } else {
          return [...filtered, categoryId];
        }
      });
    }
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle price filter change
  const handlePriceChange = (price: string) => {
    setPriceRange(prev => {
      if (prev.includes(price)) {
        return prev.filter(p => p !== price);
      } else {
        return [...prev, price];
      }
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle level filter change
  const handleLevelChange = (selectedLevel: string) => {
    setLevel(prev => {
      if (prev.includes(selectedLevel)) {
        return prev.filter(l => l !== selectedLevel);
      } else {
        return [...prev, selectedLevel];
      }
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([]);
    setLevel([]);
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Calculate pagination values
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

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
                      checked={selectedCategories.includes(category.id) || (category.id === "all" && selectedCategories.length === 0)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                      {category.name} {category.count ? `(${category.count})` : ''}
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
                    checked={priceRange.includes("free")}
                    onChange={() => handlePriceChange("free")}
                  />
                  <label htmlFor="price-free" className="ml-2 text-gray-700">Free</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="price-paid" 
                    className="h-4 w-4 text-blue-600 rounded" 
                    checked={priceRange.includes("paid")}
                    onChange={() => handlePriceChange("paid")}
                  />
                  <label htmlFor="price-paid" className="ml-2 text-gray-700">Paid</label>
                </div>
              </div>
            </div>
            
            {/* Level Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Level</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="level-beginner" 
                    className="h-4 w-4 text-blue-600 rounded" 
                    checked={level.includes("beginner")}
                    onChange={() => handleLevelChange("beginner")}
                  />
                  <label htmlFor="level-beginner" className="ml-2 text-gray-700">Beginner</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="level-intermediate" 
                    className="h-4 w-4 text-blue-600 rounded" 
                    checked={level.includes("intermediate")}
                    onChange={() => handleLevelChange("intermediate")}
                  />
                  <label htmlFor="level-intermediate" className="ml-2 text-gray-700">Intermediate</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="level-advanced" 
                    className="h-4 w-4 text-blue-600 rounded" 
                    checked={level.includes("advanced")}
                    onChange={() => handleLevelChange("advanced")}
                  />
                  <label htmlFor="level-advanced" className="ml-2 text-gray-700">Advanced</label>
                </div>
              </div>
            </div>
            
            {/* Reset Filters Button */}
            <button 
              onClick={resetFilters}
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Courses Grid */}
        <div className="md:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <span className="text-gray-600">
                {filteredCourses.length > 0 
                  ? `Showing ${indexOfFirstCourse + 1}-${Math.min(indexOfLastCourse, filteredCourses.length)} of ${filteredCourses.length} courses`
                  : "No courses found"}
              </span>
            </div>
            <div>
              <select 
                className="p-2 border border-gray-300 rounded-md"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <h3 className="text-xl font-medium mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your filters or search for something else.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
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
          )}
          
          {/* Pagination */}
          {filteredCourses.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and pages around current page
                    return (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis where needed
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <span key={`ellipsis-${page}`} className="px-3 py-1">
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 