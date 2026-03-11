import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // Clean existing data
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Create users with posts
    const alice = await prisma.user.create({
        data: {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            password: 'hashed_password_alice',
            posts: {
                create: [
                    {
                        title: 'Getting Started with Express.js',
                        content:
                            'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. In this post, we will explore the basics of setting up an Express server, defining routes, and handling middleware. Whether you are a beginner or looking to refresh your knowledge, this guide will help you get up and running quickly.',
                    },
                    {
                        title: 'Understanding Prisma ORM',
                        content:
                            'Prisma is a next-generation ORM that makes working with databases easy and intuitive. It provides a type-safe query builder, automatic migrations, and a powerful schema language. In this article, we dive deep into how Prisma simplifies database access in Node.js and TypeScript projects, covering everything from schema design to advanced querying patterns.',
                    },
                    {
                        title: 'Building RESTful APIs: Best Practices',
                        content:
                            'Designing a good RESTful API requires careful thought about resource naming, HTTP methods, status codes, and error handling. This post covers essential best practices including versioning, pagination, filtering, and authentication strategies that will make your APIs robust, scalable, and developer-friendly.',
                    },
                ],
            },
        },
    });

    const bob = await prisma.user.create({
        data: {
            name: 'Bob Smith',
            email: 'bob@example.com',
            password: 'hashed_password_bob',
            posts: {
                create: [
                    {
                        title: 'A Guide to PostgreSQL',
                        content:
                            "PostgreSQL is one of the most advanced open-source relational databases available today. Known for its reliability, feature richness, and performance, it powers some of the world's most demanding applications. This guide walks you through installation, basic SQL commands, indexing strategies, and tips for optimizing your PostgreSQL database.",
                    },
                    {
                        title: 'JavaScript Async/Await Explained',
                        content:
                            'Asynchronous programming is a cornerstone of modern JavaScript development. The async/await syntax, introduced in ES2017, provides a cleaner and more readable way to work with promises. In this post, we break down how async/await works under the hood, common pitfalls to avoid, and real-world examples to level up your asynchronous code.',
                    },
                ],
            },
        },
    });

    const carol = await prisma.user.create({
        data: {
            name: 'Carol Williams',
            email: 'carol@example.com',
            password: 'hashed_password_carol',
            posts: {
                create: [
                    {
                        title: 'CSS Grid vs Flexbox: When to Use What',
                        content:
                            'CSS Grid and Flexbox are both powerful layout systems, but they serve different purposes. Flexbox is designed for one-dimensional layouts, while Grid excels at two-dimensional layouts. This article compares the two approaches with practical examples, helping you decide which one to reach for in different scenarios.',
                    },
                    {
                        title: 'Introduction to Docker for Developers',
                        content:
                            'Docker has revolutionized the way developers build, ship, and run applications. By containerizing your application and its dependencies, Docker ensures consistency across development, testing, and production environments. This beginner-friendly guide covers Docker basics, writing Dockerfiles, and orchestrating multi-container apps with Docker Compose.',
                    },
                    {
                        title: 'The Power of Git Branching Strategies',
                        content:
                            'A well-defined Git branching strategy is essential for team collaboration and code quality. This post explores popular strategies like Git Flow, GitHub Flow, and Trunk-Based Development, discussing the pros and cons of each approach and helping you choose the right one for your team and project.',
                    },
                    {
                        title: 'Web Security Fundamentals Every Developer Should Know',
                        content:
                            'Security is not optional in modern web development. From cross-site scripting (XSS) to SQL injection and CSRF attacks, understanding common vulnerabilities is the first step to building secure applications. This comprehensive guide covers the OWASP Top 10, security headers, input validation, and authentication best practices.',
                    },
                ],
            },
        },
    });

    console.log('✅ Seeding complete!');
    console.log(`   Created 3 users and 9 posts`);
    console.log(`   Users: ${alice.name}, ${bob.name}, ${carol.name}`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
