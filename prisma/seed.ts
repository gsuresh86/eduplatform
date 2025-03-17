import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created:', admin.email);

    // Create instructor user
    const instructorPassword = await hash('instructor123', 10);
    const instructor = await prisma.user.upsert({
      where: { email: 'instructor@example.com' },
      update: {},
      create: {
        email: 'instructor@example.com',
        name: 'Jane Smith',
        password: instructorPassword,
        role: 'INSTRUCTOR',
      },
    });

    console.log('Instructor user created:', instructor.email);

    // Create regular user
    const userPassword = await hash('user123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'John Doe',
        password: userPassword,
        role: 'USER',
      },
    });

    console.log('Regular user created:', user.email);

    // Create categories
    const webDevCategory = await prisma.category.upsert({
      where: { name: 'Web Development' },
      update: {},
      create: { name: 'Web Development' },
    });

    const dataCategory = await prisma.category.upsert({
      where: { name: 'Data Science' },
      update: {},
      create: { name: 'Data Science' },
    });

    const mobileCategory = await prisma.category.upsert({
      where: { name: 'Mobile Development' },
      update: {},
      create: { name: 'Mobile Development' },
    });

    console.log('Categories created');

    // Create courses
    const webDevCourse = await prisma.course.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
        published: true,
        authorId: instructor.id,
      },
    });

    await prisma.categoryOnCourse.upsert({
      where: {
        courseId_categoryId: {
          courseId: webDevCourse.id,
          categoryId: webDevCategory.id,
        },
      },
      update: {},
      create: {
        courseId: webDevCourse.id,
        categoryId: webDevCategory.id,
      },
    });

    const reactCourse = await prisma.course.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        title: 'Advanced React Patterns',
        description: 'Master advanced React patterns and build scalable applications.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        published: true,
        authorId: instructor.id,
      },
    });

    await prisma.categoryOnCourse.upsert({
      where: {
        courseId_categoryId: {
          courseId: reactCourse.id,
          categoryId: webDevCategory.id,
        },
      },
      update: {},
      create: {
        courseId: reactCourse.id,
        categoryId: webDevCategory.id,
      },
    });

    const dataScienceCourse = await prisma.course.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        title: 'Data Science Fundamentals',
        description: 'Learn the basics of data science, statistics, and machine learning.',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        published: true,
        authorId: instructor.id,
      },
    });

    await prisma.categoryOnCourse.upsert({
      where: {
        courseId_categoryId: {
          courseId: dataScienceCourse.id,
          categoryId: dataCategory.id,
        },
      },
      update: {},
      create: {
        courseId: dataScienceCourse.id,
        categoryId: dataCategory.id,
      },
    });

    console.log('Courses created');

    // Create lessons for the web development course
    await prisma.lesson.createMany({
      skipDuplicates: true,
      data: [
        {
          title: 'Introduction to HTML',
          description: 'Learn the basics of HTML markup language',
          content: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.',
          position: 1,
          courseId: webDevCourse.id,
        },
        {
          title: 'CSS Fundamentals',
          description: 'Learn how to style your HTML with CSS',
          content: 'CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML.',
          position: 2,
          courseId: webDevCourse.id,
        },
        {
          title: 'JavaScript Basics',
          description: 'Introduction to JavaScript programming',
          content: 'JavaScript is a programming language that enables interactive web pages and is an essential part of web applications.',
          position: 3,
          courseId: webDevCourse.id,
        },
      ],
    });

    console.log('Lessons created');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 