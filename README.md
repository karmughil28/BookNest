# BookNest — MERN Library Management System (No OTP)

BookNest is a complete learning project built with **React + Vite**, **Node.js + Express**, and **MongoDB + Mongoose**. The interface uses a dark plum sidebar, rounded white cards, pink/purple accents and a spacious dashboard inspired by the design reference.

## This version has no OTP

- OTP generation, OTP verification, OTP routes, email sending and OTP database model have been removed.
- Sign-up saves the login account in the `users` collection and the student's profile in the `students` collection.
- The password is hashed with bcrypt before it is saved.
- Login checks the existing password hash and loads the linked student profile. It does **not** create another student record.
- A JWT is returned after sign-up or login. The frontend keeps it in `sessionStorage` and sends it to protected APIs as a Bearer token.

## Features

- Sign up and log in without OTP.
- Save student name, email, phone, course and year/batch in MongoDB.
- Dashboard cards and library analytics.
- Book CRUD: add, list, search, filter, update and delete.
- Student CRUD: add, list, search, update and delete.
- Search features demonstrate MongoDB `$gt`, `$lt`, `$in`, `$and`, `$or` and `$exists` operators.
- Bulk insert routes for books and students.
- Vite `/api` proxy for local development to prevent common cross-origin/network errors.
- Render Blueprint for a separate frontend static site and backend web service.

## Folder structure

```text
BookNest/
├── client/                         # React + Vite frontend
│   ├── src/components/              # Sidebar, layout, route guard, toast
│   ├── src/context/                 # Authentication state
│   ├── src/pages/                   # Login, register, dashboard, books, students, analytics
│   ├── src/services/api.js          # Axios client + Bearer token
│   ├── src/styles/                  # App and authentication styles
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js               # Proxies /api to localhost:5000
├── server/                          # Express backend
│   ├── config/db.js                 # MongoDB connection
│   ├── controllers/                 # Auth, books, students, dashboard
│   ├── middleware/                  # JWT, database readiness, error handling
│   ├── models/                      # User, Student, Book schemas
│   ├── routes/                      # REST API routes
│   ├── .env.example
│   ├── app.js
│   └── server.js
├── database/SCHEMA.md
├── postman/BookNest.postman_collection.json
├── package.json                     # Root scripts to run both servers
├── render.yaml
└── README.md
```

## Requirements

- Node.js 20.18+ (Node.js 22 recommended)
- npm
- MongoDB Atlas account, or a local MongoDB server

Check your versions:

```bash
node -v
npm -v
```

## Run locally on Ubuntu

### 1. Extract the ZIP and open the project folder

Open a terminal in the folder that contains the root `package.json`:

```bash
cd ~/Downloads/BookNest
```

### 2. Install all packages

```bash
npm install
npm run setup
```

The `setup` script installs the backend and frontend packages, including Vite.

### 3. Create the environment files

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 4. Configure MongoDB Atlas

Your Atlas connection string should use this format (replace `<db_password>` with your real database user's password):

```text
mongodb+srv://karmughil112_db_user:<db_password>@karmughil.bmgaifp.mongodb.net/libraryDB?retryWrites=true&w=majority&appName=karmughil
```

In MongoDB Atlas:

1. Open **Database Access** and confirm the database user `karmughil112_db_user` exists. Reset its password if needed.
2. Open **Network Access** and add your current IP address for local development.
3. Do not use the literal text `<db_password>`; replace it with the actual password.
4. If the password contains characters such as `@`, `#`, `/`, `:` or `%`, URL-encode those characters before placing it in the URI.

Open the backend file:

```bash
nano server/.env
```

Paste your actual URI after `MONGODB_URI=` and set `JWT_SECRET` to a strong random value. Generate a value with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Example local settings:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://karmughil112_db_user:YOUR_REAL_PASSWORD@karmughil.bmgaifp.mongodb.net/libraryDB?retryWrites=true&w=majority&appName=karmughil
JWT_SECRET=PASTE_THE_GENERATED_RANDOM_SECRET_HERE
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
```

Save nano with `Ctrl+O`, Enter, then `Ctrl+X`.

### 5. Configure the frontend

Open `client/.env`. Keep this for local use:

```env
VITE_API_URL=/api
```

Vite forwards `/api` requests to `http://127.0.0.1:5000` using `client/vite.config.js`.

### 6. Start frontend and backend together

From the root `BookNest` folder:

```bash
npm run dev
```

Open the frontend:

- Website: http://localhost:5173
- Backend health: http://localhost:5000/api/health

The health endpoint should show `"database": "connected"` after Atlas connects.

You can also run services separately:

```bash
npm run dev:server
```

```bash
npm run dev:client
```

### 7. Test sign-up and login

1. Open http://localhost:5173/register.
2. Enter full name, email, phone (optional), course, year/batch and a password of at least 8 characters.
3. Click **Create account**. The backend saves one `users` record and one linked `students` record.
4. You'll go directly to the dashboard. There is no OTP step.
5. Log out, then sign in at http://localhost:5173/login with the same email and password.
6. The login route reads your existing student profile. It does not insert a second student.
7. Open **Students** and confirm your profile appears there.

In Atlas, choose **Browse Collections**. The database is `libraryDB`, and collections `users`, `students` and `books` are created as records are added.

## API endpoints

All routes except health and authentication are protected with JWT.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API and DB health |
| POST | `/api/auth/register` | Register account + student profile |
| POST | `/api/auth/login` | Login existing account |
| GET | `/api/auth/me` | Current account and student profile |
| GET/POST | `/api/books` | List or add books |
| GET/PUT/DELETE | `/api/books/:id` | Read, update or delete one book |
| POST | `/api/books/bulk` | Insert multiple books |
| GET/POST | `/api/students` | List or add student records |
| PUT/DELETE | `/api/students/:id` | Update or delete student |
| POST | `/api/students/bulk` | Insert multiple students |
| GET | `/api/dashboard/overview` | Dashboard counts and recent records |

## MongoDB operators used

The book list API demonstrates all required operators:

- `$gt`: `minPrice` query parameter.
- `$lt`: `maxPrice` query parameter.
- `$in`: `categories=Fiction,Technology` query parameter.
- `$and`: combines all selected filters.
- `$or`: text search checks title, author and category.
- `$exists`: `hasIsbn=true` filters books with an ISBN field.

Example:

```text
GET /api/books?search=habits&minPrice=100&maxPrice=700&categories=Fiction,Technology&available=true&hasIsbn=true
```

## Troubleshooting

### Network Error in the browser

1. Keep both services running after `npm run dev`.
2. Open http://localhost:5000/api/health. The API must respond.
3. If the API URL does not open, check the backend terminal for errors.
4. If the API opens but reports database disconnected, fix the Atlas URI or Network Access allowlist.
5. Keep `VITE_API_URL=/api` in `client/.env` for local use and restart Vite after changing it.

### MongoDB connection fails

- Confirm the database username and password in Atlas.
- Replace `<db_password>` with the real password.
- URL-encode special characters in the password.
- Add your current IP under Atlas Network Access.
- Confirm the cluster hostname is exactly `karmughil.bmgaifp.mongodb.net`.

### JWT_SECRET warning

Generate a new secret using the command above. It should be at least 32 characters.

## Deploy to Render

This repo includes `render.yaml` for two Render services:

1. `booknest-api` — Node/Express web service, root directory `server`.
2. `booknest-web` — React/Vite static site, root directory `client`.

Steps:

1. Push the complete `BookNest` folder to a GitHub repository.
2. In Render, choose **New → Blueprint** and connect the repository. Or create the backend and frontend services separately using the settings in `render.yaml`.
3. For the backend, set `MONGODB_URI` to your Atlas URI and `JWT_SECRET` to a new secret in Render Environment.
4. Set backend `CLIENT_URL` to your actual frontend Render URL.
5. Set frontend `VITE_API_URL` to `https://YOUR-BACKEND.onrender.com/api`.
6. Redeploy the frontend after changing `VITE_API_URL` because Vite reads it at build time.
7. In MongoDB Atlas Network Access, allow Render to connect. For a learning setup, `0.0.0.0/0` allows all IP addresses; use it only with a strong database password and least-privilege database user. Prefer a narrower allowlist when practical.
8. Test `/api/health`, then register and log in on the public frontend.

Do not upload `server/.env` or commit passwords to GitHub. Keep only `.env.example` in the repository.
