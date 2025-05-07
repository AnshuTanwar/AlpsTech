# AlpsTech Learning Platform

A modern learning management system built with React, Node.js, and MongoDB.

## Features

- User authentication (sign up, login)
- Course catalog and enrollment
- Student dashboard
- Admin panel for managing courses and students
- Mobile-responsive design

## Project Structure

- `src/` - Frontend React application
- `server/` - Backend Express API

## Local Development

### Prerequisites

- Node.js 16+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. From the project root directory, install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.development` file with the following content:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The application should now be running at http://localhost:8080

## Deployment

### Backend Deployment (Express Server)

1. Prepare the server for production:
   ```bash
   cd server
   npm install --production
   ```

2. Set up environment variables on your hosting platform:
   - `PORT`: The port your server will run on (often set by the hosting provider)
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: Set to `production`
   - `CLIENT_URL`: The URL of your frontend application (for CORS)

3. Deploy the server code to your hosting platform (Heroku, Render, DigitalOcean, etc.)

### Frontend Deployment (React App)

1. Update `.env.production` with your production API URL:
   ```
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```

2. Build the frontend for production:
   ```bash
   npm run build
   ```

3. Deploy the contents of the `dist` folder to your web hosting service (Vercel, Netlify, etc.)

## Combined Deployment

For simplified deployment, you can deploy both the frontend and backend together:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. The Express server is already configured to serve the frontend in production mode.

3. Deploy the entire project to a service like Heroku, Render, or DigitalOcean.

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account and set up a cluster
2. Create a database named `alpstech`
3. Set up network access to allow connections from your deployment servers
4. Create a user with read/write permissions
5. Get your connection string and add it to your environment variables

## Troubleshooting

If you encounter registration issues:
1. Check the browser console for API errors
2. Verify that the backend server is running
3. Ensure MongoDB connection string is correct
4. Check CORS settings if frontend and backend are hosted on different domains

# 🎓 AlpsTech

**AlpsTech** is a modern educational platform designed for both administrators and students. It provides robust dashboards to manage courses, track results, and streamline the academic experience.

---

## ✨ Features

### 🔐 Authentication
- Separate login/signup for **Admin** and **Students**
- Secure and role-based access

### 🧑‍💼 Admin Dashboard
- Add, edit, or remove **Courses**
- Manage **Student Records**
- Publish and update **Results**

### 👨‍🎓 Student Dashboard
- Browse available courses
- **Enroll** in new courses
- Check results and course progress

---

## 🛠️ Tech Stack

This project is powered by a modern frontend stack:

- ⚡ **Vite** – Lightning-fast build tool
- 🛡️ **TypeScript** – Type-safe JavaScript
- ⚛️ **React** – Component-based UI
- 🎨 **shadcn/ui** – Elegant and accessible UI components
- 💨 **Tailwind CSS** – Utility-first styling framework

---
## 📸 Demo Screenshots & 🎥 Preview

### 🖼️ Screenshots

<p align="center">
  <img src="https://ik.imagekit.io/anshut/alpstech/Screenshot%202025-04-09%20204035.png?updatedAt=1744211808005" alt="Student Dashboard" width="45%" />
  <img src="https://ik.imagekit.io/anshut/alpstech/Screenshot%202025-04-09%20204131.png?updatedAt=1744211808471" alt="Admin Dashboard" width="45%" />
</p>

---

### 🎥 Video Demo

▶️ [Watch Demo Video](https://ik.imagekit.io/anshut/alpstech/Recording%202025-04-09%20204544.mp4?updatedAt=1744211855521)

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/AnshuTanwar/Alps-sTech-Reaching-the-peak-of-learning-and-skills
cd alpstech
 
### 2. Install Dependencies

```bash
npm install --legacy-peer-deps

### 3. Run the server
```bash
npm run dev