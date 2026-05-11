# EduVerse 🎓

A campus marketplace and events platform built for college students — buy, sell, discover events, and grow together.

**Live Demo** → [eduverse-scholr.vercel.app](https://eduverse-scholr.vercel.app)

---

## What is EduVerse?

EduVerse is a full-stack web app where college students can:
- Browse and list products on the campus marketplace
- Discover and register for college events
- Connect with other students on campus

> **Learn · Grow · Thrive**

---

## Tech Stack

**Frontend**
- React + Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios
- Vite

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- REST API

**Deployment**
- Frontend → Vercel
- Backend → Render

---

## Features

- JWT based authentication (register, login, protected routes)
- Campus Marketplace — list, browse, and manage products
- Events Page — discover college events with filters
- Admin Dashboard — manage users, listings, and events
- Dark / Light theme toggle
- Fully responsive design

---

## Getting Started Locally

**Prerequisites**
- Node.js v18+
- MongoDB Atlas account

**1. Clone the repo**
```bash
git clone https://github.com/Tanuchouhan19/eduverse.git
cd eduverse
```

**2. Setup Backend**
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=          # leave empty for local dev
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`  
Backend runs at `http://localhost:8080`

---

## Project Structure

```
eduverse/
├── client/              # React frontend
│   ├── src/
│   │   ├── features/    # Redux slices + services
│   │   ├── pages/       # Route pages
│   │   ├── components/  # Reusable components
│   │   └── config/      # API config
│   └── vite.config.js
│
└── server/              # Express backend
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    └── server.js
```

---

## Environment Variables

**Backend (`server/.env`)**

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT tokens |
| `CLIENT_URL` | Frontend URL for CORS |

**Frontend (`client/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (empty for local dev) |

---

## Author

**Tanu Chouhan**
- LinkedIn → [chouhantanu](https://www.linkedin.com/in/chouhantanu)
- GitHub → [Tanuchouhan19](https://github.com/Tanuchouhan19)
