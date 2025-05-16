# 🗂️ Task Management App

A full-stack task management application built with Node.js, Express, Handlebars, and SQLite. This project demonstrates user authentication, task CRUD operations, server-side rendering (SSR) with dynamic client-side interactivity, and a responsive UI.

---

## 🚀 Features

### ✅ Core Functionality

- View all tasks (list layout)
- Add new tasks with required fields (title & description)
- Mark tasks as completed
- Delete tasks
- Input validation on both frontend and backend
- Error handling (e.g. 404 for missing task, 401 for auth)

### ✅ RESTful API

- `GET /tasks` – retrieve all tasks (with optional filters)
- `POST /tasks` – create new task (auth required)
- `PUT /tasks/:id` – update task status or info
- `DELETE /tasks/:id` – delete task

### ✅ User Authentication (JWT + Cookie)

- Login and logout
- Roles: `admin`, `user`
- Authenticated tasks are owned by users
- Admin can see all tasks; regular users see only their own

### ✅ UI & UX

- Clean, responsive layout styled with TailwindCSS
- Login page with demo user autofill buttons
- SSR for initial task list and edit page
- Client-side rendering used for task filtering and sorting
- Optimistic UI for task updates and deletions
- Button lock during async operations to prevent duplicates
- User's name and logout button shown in the header

---

## 🗂️ Demo Accounts

You can use the following accounts to test login:

| Role  | Username | Password   |
| ----- | -------- | ---------- |
| Admin | `admin`  | `admin123` |
| User  | `user`   | `user123`  |

---

## ⚙️ Technology Stack

- **Backend**: Node.js, Express, Fastify (for plugin-like structure)
- **Frontend**: HTML + Tailwind CSS + jQuery
- **Template Engine**: Handlebars (server-rendered views)
- **Database**: SQLite (via `sqlite3` module for Glitch compatibility)
- **Auth**: JSON Web Token (JWT) + Cookies

---

## 🛠 Development Notes

- Database initialization is modular and safe (skips if data exists)
- Designed for platforms like **Glitch** – avoids native C++ bindings (replaced `better-sqlite3` with `sqlite3`)
- All Handlebars templates avoid nested expressions for maximum compatibility
- For enhanced interactivity:
  - First page render uses **server-side rendering (SSR)**
  - Filtering and sorting after that use **client-side rendering via API** for speed and better UX

---

## 📦 Setup & Run

### 🧪 Local:

```bash
pnpm install
pnpm start
```

### 🌐 Or try on Glitch:

Just upload the project, install dependencies, and it runs!

---
