# V-ERP Server 🚀

The backend engine for the V-ERP Dashboard, built with Node.js, Express, and Supabase. This server handles authentication, Role-Based Access Control (RBAC), and module-specific data management.

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Logging**: Morgan

## ✨ Key Features

- **Modular Architecture**: Organized into feature-based modules (Auth, RBAC, Dashboard, etc.).
- **RBAC System**: Granular Role-Based Access Control with per-module permissions (Read, Write, Delete).
- **Secure Authentication**: JWT-based session management with password hashing.
- **API Error Handling**: Centralized error management system.
- **Auto-Sync Logic**: Bootstrap utilities for production RBAC synchronization.

## 📁 Project Structure

```text
server/
├── src/
│   ├── config/         # Database and third-party configurations
│   ├── errors/         # Global error handling logic
│   ├── middlewares/    # Auth, Validation, and Security middlewares
│   ├── modules/        # Feature-based modules
│   │   ├── auth/       # Login, Register, User management
│   │   ├── rbac/       # Roles and Permissions management
│   │   └── dashboard/  # Stats and Metrics
│   ├── routes/         # Main router entry point
│   └── server.js       # App entry point
├── docs/               # API documentation (Postman collections)
└── supabase/           # Database migrations and seed scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Account & Project

### Installation

1. Clone the repository and navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm run dev`: Starts the server with `nodemon` for development.
- `npm start`: Starts the server in production mode.
- `npm build`: Placeholder for build steps (not required for current JS setup).

## 🛡 API Endpoints (Core)

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `GET /api/auth/users`: List all users (Admin only)

### RBAC Management
- `GET /api/rbac/roles`: Fetch all roles
- `POST /api/rbac/roles`: Create a new role
- `GET /api/rbac/permissions`: List all available permissions
- `POST /api/rbac/bootstrap-admin`: Sync production permissions (Secure)

### Dashboard
- `GET /api/dashboard/stats`: Fetch high-level ERP statistics

## 📄 License

This project is licensed under the ISC License.
