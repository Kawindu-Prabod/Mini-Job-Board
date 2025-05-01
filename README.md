# 🧑‍💼 Job Portal Web App

This is a full-stack **Job Portal** web application built with **Next.js**, **Tailwind CSS**, and **Postgresql** (via Supabase). It allows administrators to register, log in, publish job vacancies, and manage their own job listings.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Auth Handling**: Simulated session (via `localStorage`)
- **Deployment Ready**: Structured for Vercel or custom deployment

---

## 🧱 Database Schema

### `admin` Table
| Column     | Type     | Notes                 |
|------------|----------|-----------------------|
| email      | TEXT     | Primary Key           |
| first_name | TEXT     |                       |
| last_name  | TEXT     |                       |
| password   | TEXT     | Hashed/Plaintext      |

### `jobs` Table
| Column       | Type    | Notes                           |
|--------------|---------|---------------------------------|
| id           | SERIAL  | Primary Key                     |
| user_email   | TEXT    | Foreign key to `admin.email`    |
| title        | TEXT    | Job title                       |
| company      | TEXT    | Company name                    |
| location_type| TEXT    | `remote`, `onsite`, or `hybrid` |
| location     | TEXT    | Conditional based on type       |
| job_type     | TEXT    | `full-time`, `part-time`, etc..  |
| description  | TEXT    | Job description                 |

---

## 🔐 Session Handling

- On login, `sessionStatus` and `email` are saved in `localStorage`.
- Sessions expire after 15 minutes via timeout logic.
- Access to `/profile` is gated — unauthenticated users are redirected to `/login`.

---

## 📦 Features

- ✅ **Admin Sign Up & Login**
- ✅ **Post New Job Modal**
- ✅ **"My Jobs" Section in Profile**
- ✅ **Delete Job Functionality**
- ✅ **Protected Routes via LocalStorage Check**
- ✅ **Responsive UI with Dark Mode**
- ✅ **API Routes for Secure DB Access**

---

<b>Make a .env file with DATABASE_URL=your-supabase-postgres-connection-string</b>
