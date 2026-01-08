# 🧠 Smart IssueBoard

Smart IssueBoard is a simple issue-tracking web application built as part of an internship assignment.
It allows users to create, view, filter, and manage issues with authentication, workflow rules, and basic intelligent duplicate detection.

The project focuses on **real-world problem solving**, **clean architecture**, and **practical decision-making** rather than overengineering.

---

## 🚀 Live Demo

👉 *(Add your Vercel deployment link here)*

---

## 🛠 Tech Stack

### Frontend

* **React (Vite)**
* JavaScript
* React Router DOM

### Backend / Database

* **Firebase Firestore**

### Authentication

* **Firebase Authentication (Email/Password)**

### Hosting

* **Vercel**

### Code Hosting

* **GitHub (Public Repository)**

---

## ❓ Why I Chose React + Vite

I chose **React with Vite** for the frontend because:

* Vite provides extremely fast development and build times
* React is widely used in real-world applications
* The ecosystem works seamlessly with Firebase
* Easy deployment on Vercel
* Keeps the project simple, readable, and scalable

This stack allowed me to focus on **logic and features** instead of tooling complexity.

---

## 🔐 Authentication Features

* User Signup using Email & Password
* User Login using Email & Password
* Logged-in user’s email is displayed on the dashboard
* Logout functionality
* Authentication state handled using Firebase Auth

---

## 🗂 Firestore Data Structure

### `issues` Collection

Each issue is stored as a document with the following fields:

```json
{
  "title": "Login fails for valid users",
  "description": "Users are unable to log in even with correct credentials.",
  "priority": "High",
  "status": "Open",
  "assignedTo": "Backend Developer",
  "createdBy": "user@example.com",
  "createdAt": "Firestore Timestamp"
}
```

### Why this structure?

* Flat collection makes querying fast and simple
* Easy filtering by status and priority
* Scales well for small to medium applications
* Keeps Firestore reads efficient

---

## 📝 Core Features

### 1️⃣ Create Issue

Users can create an issue with:

* Title
* Description
* Priority (Low / Medium / High)
* Status (default: Open)
* Assigned To
* Automatically stored:

  * Created By (user email)
  * Created Time (timestamp)

---

### 2️⃣ Issue List

* Displays all issues in real time
* Sorted by **newest first**
* Shows all issue details
* Live updates using Firestore listeners

---

### 3️⃣ Filtering

* Filter issues by:

  * Status (Open / In Progress / Done)
  * Priority (Low / Medium / High)
* Filters are applied client-side for better responsiveness

---

### 4️⃣ Status Transition Rule

A business rule is enforced:

❌ **An issue cannot move directly from Open → Done**
✅ It must go **Open → In Progress → Done**

If an invalid transition is attempted:

* The update is blocked
* A friendly message is shown to guide the user

This ensures proper workflow consistency.

---

## ⭐ Similar Issue Handling (Intelligent Logic)

When creating a new issue:

* The app compares the new issue title with existing issues
* Uses keyword overlap to detect potential duplicates
* Common stop-words are ignored / threshold is increased to reduce false positives

### Behavior:

* If a similar issue is detected:

  * A warning message is shown
  * User can choose to:

    * Cancel
    * Create the issue anyway

### Why this approach?

* Simple and explainable
* No heavy NLP or AI libraries
* Easy to improve in the future
* Balances usability and correctness

---

## ⚠️ Challenges Faced

* Designing similarity detection without overengineering
* Avoiding false positives in duplicate detection
* Managing Firestore real-time updates
* Enforcing workflow rules cleanly in the UI
* Handling Firebase configuration securely using environment variables

---

## 🔮 What I Would Improve Next

If given more time, I would:

* Add role-based access (admin, developer, viewer)
* Add comments on issues
* Improve UI with better styling (Tailwind / Material UI)
* Add pagination for large issue lists
* Use better NLP techniques for similarity detection
* Add Firestore security rules for production

---

## 🔐 Security & Environment Variables

* Firebase configuration is stored in environment variables
* `.env` file is excluded using `.gitignore`
* Environment variables are configured again during Vercel deployment

---

## 📦 Deployment

* The application is deployed on **Vercel**
* Firebase services are used in production mode
* The deployed app is fully usable

---

## 👤 Author

**Manish**
Internship Assignment – Smart IssueBoard

---

