Kothika – AI-Powered Blogging Platform
📌 Overview

Kothika is a full-stack AI-powered blogging platform built using Spring Boot (backend) and React (frontend).

It allows users to create, manage, and publish blog posts organized by categories and tags, with an additional AI-powered content generation feature that helps users create posts intelligently.

The project demonstrates modern development practices including REST APIs, clean architecture, DTO-based design, and AI integration.

✨ Key Highlights

🧠 AI-powered post generation

📝 Full blog management system (CRUD)

🏷️ Category & tag-based organization

⚡ Clean layered backend architecture

🔄 DTO-based communication

🌐 Modern React frontend

📊 Scalable and production-ready design

🛠️ Tech Stack
🔙 Backend

Java 17+

Spring Boot

Spring Web

Spring Data JPA

Spring Validation

Hibernate

🌐 Frontend

React.js

JavaScript (ES6+)

HTML, CSS

Axios (API calls)

🤖 AI Integration

Gemini API / OpenAI API (for post generation)

🗄️ Database

MySQL

⚙️ Tools & Libraries

ModelMapper

Lombok

Maven

🏗️ System Architecture
Frontend (React)
        ↓
REST API (Spring Boot)
        ↓
Service Layer
        ↓
Repository Layer
        ↓
Database (MySQL)
📊 Core Features
👤 User Management

Create user

Update user

Delete user

Get user details

📝 Post Management

Create, update, delete posts

Draft & publish system

Assign categories and tags

Automatic timestamps

🧠 AI Post Generator (🔥 Highlight Feature)

Users can generate blog content using AI.

Example Flow:

User enters topic/title

AI generates content

User edits and publishes

Example API:
POST /ai/generate-post
Sample Request:
{
  "title": "Spring Boot Guide"
}
Sample Response:
{
  "generatedContent": "Spring Boot is a powerful framework..."
}
📂 Categories

Create categories

Assign posts

View category-wise posts

Post count per category

🏷️ Tags

Create tags

Attach to posts

Many-to-many relationship

Tag usage count

🗄️ Database Design
Tables

users

posts

categories

tags

post_tag

🔄 DTO Architecture
📥 Request DTO
{
  "title": "Post Title",
  "content": "Post Content",
  "categoryId": 1,
  "tagIds": [1, 2],
  "status": "PUBLISHED"
}
📤 Response DTO
{
  "id": "uuid",
  "title": "Post Title",
  "authorName": "Sourav",
  "categoryName": "Tech",
  "tags": ["Java", "Spring"],
  "createdAt": "2026-03-19"
}
🔁 Object Mapping

ModelMapper used for:

Entity → DTO

DTO → Entity

✅ Validation

Using Jakarta Validation:

@NotBlank

@NotNull

@Size

📌 Business Rules

Author cannot be changed after post creation

Category must exist

Tags must exist

Only valid statuses allowed

▶️ Getting Started
1️⃣ Clone Repository
git clone https://github.com/your-username/kothika.git
cd kothika
2️⃣ Backend Setup
cd backend
mvn clean install
mvn spring-boot:run
3️⃣ Frontend Setup
cd frontend
npm install
npm start

Frontend runs on:

http://localhost:3000

Backend runs on:

http://localhost:8080
🔮 Future Enhancements

🔐 JWT Authentication

👥 Role-based access

🔍 Advanced search

📄 Pagination

⚡ Redis caching

📊 Analytics dashboard

📱 Mobile-friendly UI
