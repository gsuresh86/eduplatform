// Load environment variables from .env file
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMoreCourses() {
  try {
    // Get the instructor ID since courses require an author
    const instructor = await prisma.user.findUnique({
      where: { email: 'instructor@example.com' },
    });

    if (!instructor) {
      console.error('Instructor user not found. Please run seed.ts first.');
      return;
    }

    // Fetch existing categories
    const webDevCategory = await prisma.category.findUnique({
      where: { name: 'Web Development' },
    });

    const dataCategory = await prisma.category.findUnique({
      where: { name: 'Data Science' },
    });

    const mobileCategory = await prisma.category.findUnique({
      where: { name: 'Mobile Development' },
    });

    // Create a new category
    const aiCategory = await prisma.category.upsert({
      where: { name: 'Artificial Intelligence' },
      update: {},
      create: { name: 'Artificial Intelligence' },
    });

    const securityCategory = await prisma.category.upsert({
      where: { name: 'Cybersecurity' },
      update: {},
      create: { name: 'Cybersecurity' },
    });

    console.log('Categories created or fetched');

    // Array of new courses to add
    const newCourses = [
      {
        id: '4',
        title: 'Node.js Backend Development',
        description: 'Learn how to build scalable and robust backend services with Node.js and Express.',
        price: 69.99,
        imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
        published: true,
        authorId: instructor.id,
        categoryId: webDevCategory?.id,
        lessons: [
          {
            title: 'Introduction to Node.js',
            description: 'Learn the basics of Node.js and its architecture',
            content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine that allows you to run JavaScript on the server side.',
            position: 1,
          },
          {
            title: 'Express Framework Basics',
            description: 'Getting started with the Express web framework',
            content: 'Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
            position: 2,
          },
          {
            title: 'Building RESTful APIs',
            description: 'Learn how to design and implement RESTful APIs',
            content: 'REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP requests to perform CRUD operations.',
            position: 3,
          }
        ]
      },
      {
        id: '5',
        title: 'Python for Machine Learning',
        description: 'Master essential Python libraries such as NumPy, Pandas, and Scikit-learn for machine learning.',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        published: true,
        authorId: instructor.id,
        categoryId: aiCategory?.id,
        lessons: [
          {
            title: 'Python Fundamentals for Data Science',
            description: 'Python basics with focus on data science applications',
            content: 'Python is a versatile programming language widely used in data science and machine learning due to its readability and rich ecosystem of libraries.',
            position: 1,
          },
          {
            title: 'Data Manipulation with Pandas',
            description: 'Learn how to analyze and manipulate data using Pandas',
            content: 'Pandas is a fast, powerful, flexible and easy to use open source data analysis and manipulation tool, built on top of the Python programming language.',
            position: 2,
          },
          {
            title: 'Machine Learning with Scikit-learn',
            description: 'Introduction to machine learning algorithms',
            content: 'Scikit-learn is a free software machine learning library for the Python programming language that features various classification, regression and clustering algorithms.',
            position: 3,
          }
        ]
      },
      {
        id: '6',
        title: 'Flutter Mobile App Development',
        description: 'Build cross-platform mobile applications with Flutter and Dart.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        published: true,
        authorId: instructor.id,
        categoryId: mobileCategory?.id,
        lessons: [
          {
            title: 'Dart Programming Language',
            description: 'Learn the basics of Dart for Flutter development',
            content: 'Dart is a client-optimized programming language for apps on multiple platforms. It is developed by Google and is used to build mobile, desktop, server, and web applications.',
            position: 1,
          },
          {
            title: 'Flutter UI Fundamentals',
            description: 'Learn how to build beautiful user interfaces with Flutter',
            content: 'Flutter is Google\'s UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.',
            position: 2,
          },
          {
            title: 'State Management in Flutter',
            description: 'Learn different state management techniques in Flutter',
            content: 'State management is a critical aspect of Flutter development. Flutter offers several approaches to state management including Provider, Riverpod, and Bloc.',
            position: 3,
          }
        ]
      },
      {
        id: '7',
        title: 'Cybersecurity Fundamentals',
        description: 'Learn the basics of cybersecurity, threat detection, and protection strategies.',
        price: 99.99,
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        published: true,
        authorId: instructor.id,
        categoryId: securityCategory?.id,
        lessons: [
          {
            title: 'Introduction to Cybersecurity',
            description: 'Understanding the fundamental concepts of cybersecurity',
            content: 'Cybersecurity refers to the practice of protecting systems, networks, and programs from digital attacks. These attacks are usually aimed at accessing, changing, or destroying sensitive information.',
            position: 1,
          },
          {
            title: 'Network Security',
            description: 'Learn how to secure computer networks from intruders',
            content: 'Network security consists of the policies, processes and practices adopted to prevent, detect and monitor unauthorized access, misuse, modification, or denial of a computer network and network-accessible resources.',
            position: 2,
          },
          {
            title: 'Ethical Hacking',
            description: 'Introduction to ethical hacking and penetration testing',
            content: 'Ethical hacking involves an authorized attempt to gain unauthorized access to a computer system, application, or data. It involves identifying weaknesses in computer systems and networks and coming up with countermeasures.',
            position: 3,
          }
        ]
      },
      {
        id: '8',
        title: 'Modern JavaScript (ES6+)',
        description: 'Master modern JavaScript features and patterns for professional web development.',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        published: true,
        authorId: instructor.id,
        categoryId: webDevCategory?.id,
        lessons: [
          {
            title: 'ES6 Syntax and Features',
            description: 'Learn modern JavaScript syntax introduced in ES6',
            content: 'ECMAScript 2015 or ES6 introduced many new features to JavaScript including arrow functions, template literals, destructuring, spread operator, and more.',
            position: 1,
          },
          {
            title: 'Asynchronous JavaScript',
            description: 'Master promises, async/await and other asynchronous patterns',
            content: 'Asynchronous programming is essential for JavaScript applications to handle operations that take time without blocking the main thread.',
            position: 2,
          },
          {
            title: 'Modern JavaScript Modules',
            description: 'Understanding module systems in JavaScript',
            content: 'JavaScript modules allow you to break up your code into separate files, making it more maintainable and reusable across your application.',
            position: 3,
          }
        ]
      }
    ];

    // Create each course and its associated lessons
    for (const courseData of newCourses) {
      const { lessons, categoryId, ...courseInfo } = courseData;
      
      // Create the course
      const course = await prisma.course.upsert({
        where: { id: courseInfo.id },
        update: {},
        create: courseInfo,
      });

      console.log(`Course created: ${course.title}`);

      // Create lessons for the course
      if (lessons && lessons.length > 0) {
        for (const lessonData of lessons) {
          await prisma.lesson.create({
            data: {
              ...lessonData,
              courseId: course.id,
            },
          });
        }
        console.log(`${lessons.length} lessons created for ${course.title}`);
      }

      // Associate the course with a category if provided
      if (categoryId) {
        await prisma.categoryOnCourse.upsert({
          where: {
            courseId_categoryId: {
              courseId: course.id,
              categoryId,
            },
          },
          update: {},
          create: {
            courseId: course.id,
            categoryId,
          },
        });
        console.log(`Category association created for ${course.title}`);
      }
    }

    console.log('All new courses added successfully');
  } catch (error) {
    console.error('Error adding courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreCourses()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 