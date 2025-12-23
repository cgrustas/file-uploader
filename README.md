# File Uploader

A personal cloud storage application inspired by Google Drive, built as part of [The Odin Project](https://www.theodinproject.com/) curriculum.

## Introduction

File Uploader is a web application that allows authenticated users to upload, organize, and manage their files in the cloud. Users can create nested folder structures, upload files to specific directories, view file details, and download their stored content. The application features secure session-based authentication and integrates with Cloudinary for reliable cloud file storage.

## Features

- User registration and authentication with persistent sessions
- File upload with size validation (10MB limit)
- Cloud storage integration via Cloudinary
- Nested folder CRUD operations
- File details view including name, size, and upload time
- File download functionality
- Breadcrumb navigation through folder hierarchy

## Skills Demonstrated

### Object-Relational Mapping

- Understanding what ORMs are and why they simplify database interactions
- Implementing Prisma ORM for type-safe database queries
- Leveraging Prisma features including schema modeling, migrations, and the Prisma Client

### Backend Development

- Building RESTful routes with Express.js
- Implementing middleware patterns for authentication and authorization
- Handling file uploads with Multer
- Integrating third-party cloud storage services (Cloudinary)

### Authentication & Security

- Session-based authentication using Passport.js with local strategy
- Password hashing with bcryptjs
- Persisting sessions in the database with Prisma Session Store

### Database Design

- Modeling relational data with self-referential relationships (nested folders)
- Writing recursive queries

### Error Handling

- Creating custom error classes for meaningful HTTP responses
- Implementing Express error middleware

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** Passport.js
- **File Uploads:** Multer
- **Cloud Storage:** Cloudinary
- **Templating:** EJS
