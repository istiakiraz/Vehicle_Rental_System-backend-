# 🚗 Vehicle Rental System - Backend API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2-black.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PG--8.23-336791.svg)](https://www.postgresql.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000.svg)](https://vercel.com/)

A robust, scalable RESTful API backend built for a **Vehicle Rental System** using **Node.js, Express, TypeScript, and PostgreSQL**. This system manages user authentications, roles (Admin/Customer), vehicle inventories, and rental bookings with strict data constraints and access control.

🔗 **Live API URL**: [https://vehicle-rental-system-beryl.vercel.app/](https://vehicle-rental-system-beryl.vercel.app/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Prerequisites & Environment Variables](#-prerequisites--environment-variables)
- [Setup & Installation Instructions](#-setup--installation-instructions)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)

---

## ✨ Features

- 🔐 **Authentication & Authorization**: Secure User Registration & Login using **Bcrypt.js** password hashing and **JWT (JSON Web Tokens)** for Role-Based Access Control (`admin` & `customer`).
- 🚘 **Vehicle Inventory Management**: Full CRUD operations for managing vehicles (cars, bikes, vans, SUVs). Admins can add, update, and remove vehicles while tracking availability status.
- 📅 **Rental Booking Engine**: Customers can book available vehicles by specifying rental start and end dates. Calculates total price automatically and tracks booking state (`active`, `cancelled`, `returned`).
- 👤 **User Profile Management**: Role-restricted user administration allowing profile updates and account management.
- 🗄️ **Relational Database Integrity**: Built on PostgreSQL with explicit foreign key relations (`ON DELETE CASCADE`), CHECK constraints, and strict data validation.
- ⚡ **Auto Schema Initialization**: Automatic SQL table creation on server startup.
- 🌐 **Serverless Ready**: Configured for seamless deployment on Vercel with Express 5.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript (`^5.9.3`)
- **Web Framework**: Express.js (`^5.2.1`)
- **Database**: PostgreSQL (connected via `pg` Pool `^8.23.0`)
- **Authentication**: `jsonwebtoken` & `bcryptjs`
- **Development Tooling**: `tsx` (TypeScript Execution Engine), `dotenv`
- **Deployment**: Vercel Serverless Functions

---

## 🗄️ Database Schema

The database relies on three core PostgreSQL tables created dynamically:

### 1. `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Auto-incrementing unique user ID |
| `name` | `VARCHAR(100)` | `NOT NULL` | User's full name |
| `email` | `VARCHAR(150)` | `UNIQUE`, `NOT NULL`, Lowercase check | User email address |
| `password` | `TEXT` | `NOT NULL`, Length >= 6 | Hashed password |
| `phone` | `VARCHAR(15)` | `NOT NULL` | Contact number |
| `role` | `VARCHAR(20)` | Default `'customer'`, Check (`admin`, `customer`) | System access role |

### 2. `vehicles`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Auto-incrementing vehicle ID |
| `vehicle_name` | `TEXT` | `NOT NULL` | Model / name of vehicle |
| `type` | `VARCHAR(20)` | `NOT NULL`, Check (`car`, `bike`, `van`, `SUV`) | Vehicle category |
| `registration_number` | `TEXT` | `UNIQUE`, `NOT NULL` | Registration/license plate |
| `daily_rent_price` | `NUMERIC(10,2)`| `NOT NULL`, > 0 | Daily rental cost |
| `availability_status`| `VARCHAR(20)` | Default `'available'`, Check (`available`, `booked`) | Current vehicle availability |

### 3. `bookings`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique booking ID |
| `customer_id` | `INT` | `REFERENCES users(id) ON DELETE CASCADE` | Associated user ID |
| `vehicle_id` | `INT` | `REFERENCES vehicles(id)` | Associated vehicle ID |
| `rent_start_date` | `DATE` | `NOT NULL` | Start date of rental |
| `rent_end_date` | `DATE` | `NOT NULL`, Must be after start date | End date of rental |
| `total_price` | `NUMERIC(10,2)`| `NOT NULL` | Calculated total rental cost |
| `status` | `VARCHAR(20)` | Default `'active'`, Check (`active`, `cancelled`, `returned`) | Booking status |

---

## 📡 API Endpoints Overview

All endpoints are prefixed with `/api/v1`.

### 🔑 Authentication (`/api/v1/auth`)
- **`POST /api/v1/auth/signup`** – Register a new user.
- **`POST /api/v1/auth/signin`** – Authenticate user and receive a JWT authorization token.
- **`POST /api/v1/auth/signout`** – Delete the JWT token (`customer` or `admin`).

### 🚗 Vehicle Management (`/api/v1/vehicles`)
- **`GET /api/v1/vehicles`** – Retrieve all vehicles (Public).
- **`GET /api/v1/vehicles/:id`** – Retrieve details of a specific vehicle by ID (Public).
- **`POST /api/v1/vehicles`** – Add a new vehicle (*Admin only*).
- **`PUT /api/v1/vehicles/:id`** – Update vehicle information (*Admin only*).
- **`DELETE /api/v1/vehicles/:id`** – Remove a vehicle (*Admin only*).

### 👥 User Management (`/api/v1/users`)
- **`GET /api/v1/users`** – Retrieve list of all users (*Admin only*).
- **`PUT /api/v1/users/:id`** – Update user details (*Admin / Customer*).
- **`DELETE /api/v1/users/:id`** – Delete a user account (*Admin only*).

### 📋 Booking System (`/api/v1/bookings`)
- **`POST /api/v1/bookings`** – Create a new vehicle rental booking (*Admin / Customer*).
- **`GET /api/v1/bookings`** – Retrieve list of bookings (*Admin gets all, Customer gets personal bookings*).
- **`PUT /api/v1/bookings/:id`** – Update booking status (e.g., mark as `returned` or `cancelled`) (*Admin / Customer*).

---

## ⚙️ Prerequisites & Environment Variables

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A running **PostgreSQL** database (Local instance or cloud provider like Neon, Supabase, or Aiven)

### Environment Variables
Create a `.env` file in the root directory of the project with the following keys:

```env
PORT=5000
CONNECTION_STR=postgres://username:password@hostname:5432/database_name?sslmode=require
JWT_SECRET=your_super_secret_jwt_key_here
```

---

## 🚀 Setup & Installation Instructions

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Assignment-02-Vehicle-Rental-System.git
   cd Assignment-02-Vehicle-Rental-System
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your connection string and JWT secret (see above).

---

## 💻 Running the Application

### Development Mode
To start the application locally with hot-reloading:
```bash
npm run dev
```
The server will start listening at `http://localhost:5000` and automatically connect to PostgreSQL, creating tables if they do not exist.

### Production Build
To build the TypeScript files into JavaScript (`/dist` folder):
```bash
npm run build
```

---

## 📁 Project Structure

```
.
├── src/
│   ├── config/             # DB connection & Environment configuration
│   │   ├── db.ts           # PostgreSQL Pool & SQL table initialization
│   │   └── index.ts        # Dotenv config setup
│   ├── middleware/         # Auth & Role middleware
│   │   └── authMiddleware.ts
│   ├── modules/            # Feature Modules (Routes, Controllers, Services)
│   │   ├── auth/           # Authentication module
│   │   ├── booking/        # Vehicle booking management
│   │   ├── user/           # User management
│   │   └── vehicle/        # Vehicle management
│   ├── types/              # Express custom type definitions
│   ├── app.ts              # Express App setup & middleware routing
│   └── server.ts           # HTTP Server bootstrap
├── .env                    # Environment variables configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vercel.json             # Vercel deployment configuration
```

---

## 📄 License

This project is licensed under the ISC License.
