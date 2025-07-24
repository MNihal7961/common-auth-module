# Common Auth System

A full-stack authentication system using **React (Vite + TypeScript)** for the frontend and **NestJS + MongoDB** for the backend. It features JWT authentication, refresh tokens, protected and public routes, and Redux for state management.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TypeScript, Redux Toolkit, React Router
- **Backend:** NestJS, MongoDB, Mongoose, Passport, JWT

---

## 📁 Project Structure

```
common-auth/
├── front-end/   # React + Vite + TS (client)
├── back-end/    # NestJS + MongoDB (server)
└── README.md    # Project documentation
```

### Frontend Structure

```
front-end/
├── src/
│   ├── pages/      # SignIn, SignUp, Home
│   ├── store/      # Redux store and slices
│   ├── App.tsx     # Routing and protection
│   └── ...
```

### Backend Structure

```
back-end/
├── src/
│   ├── auth/       # Auth module, controller, service, guards, strategies
│   ├── user/       # User module, schema, service
│   ├── app.module.ts
│   └── ...
```

---

## 🔒 Features

- **JWT Authentication** (access & refresh tokens)
- **Auto-refresh** of tokens and auto sign-out on expiry
- **Protected routes** (Home) and **public routes** (SignIn, SignUp)
- **Redux** for global auth state and persistence
- **NestJS global JWT guard** (all routes protected by default, use `@Public()` for open routes)

---

## 🚀 How to Use

### 1. Clone and Install
```sh
# In project root
git clone <repo-url> common-auth
cd common-auth

# Install backend dependencies
cd back-end
npm install

# Install frontend dependencies
cd ../front-end
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running locally (default: `mongodb://localhost/common-auth`).

### 3. Start Backend
```sh
cd back-end
npm run start:dev
```

### 4. Start Frontend
```sh
cd front-end
npm run dev
```

### 5. Open in Browser
Go to [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Auth Flow

- **Sign Up:** Create a new user (public route)
- **Sign In:** Get JWT and refresh token (public route)
- **Home:** Protected, only for authenticated users
- **Sign Out:** Clears tokens and redirects to Sign In
- **Token Refresh:** Handled automatically before expiry

---

## 🖼️ Architecture Diagram

```mermaid
flowchart TD
    subgraph "Frontend (React + Vite + TS)"
        A1["/signin (Sign In Page)"]
        A2["/signup (Sign Up Page)"]
        A3["/ (Home - Protected)"]
        A4["Redux Store"]
        A5["JWT/Refresh Token Storage"]
    end
    subgraph "Backend (NestJS + MongoDB)"
        B1["/auth/signup"]
        B2["/auth/signin"]
        B3["/auth/refresh"]
        B4["/auth/me"]
        B5["JWT/Refresh Token Logic"]
        B6["MongoDB User Model"]
    end
    A1--POST-->B2
    A2--POST-->B1
    A3--GET-->B4
    A4--dispatch-->A5
    A5--send-->B2
    A5--send-->B3
    B2--return JWT/Refresh-->A5
    B3--return new JWT-->A5
    B1--create user-->B6
    B2--find user-->B6
    B4--find user-->B6
    B5--verify/issue tokens-->A5
    A3--if not auth-->A1
    A3--if not auth-->A2
    A1--if auth-->A3
    A2--if auth-->A3
```

---

## 📢 Notes
- Use `@Public()` on any backend route you want to be accessible without authentication.
- All other routes are protected by JWT by default.
- For production, restrict CORS and use environment variables for secrets. 