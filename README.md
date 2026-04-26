# 🚀 ServiceHub - Connecting Clients with Local Services

ServiceHub is a full-stack MERN application that connects users with local service providers like plumbers, electricians, cleaners, and more.

---

## 📌 Features

- 👤 User Authentication (Login / Register with JWT)
- 🛠️ Service Listing & Management
- 📅 Booking System
- ☁️ Image Upload (Cloudinary)
- 🔐 Secure Backend APIs
- 📦 RESTful Architecture

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Axios
- CSS / Bootstrap

### Backend:
- Node.js
- Express.js

### Database:
- MongoDB

### Other Tools:
- Cloudinary (Image Upload)
- JWT Authentication

---

## 📁 Project Structure

servicehub/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── frontend/ (if present)
│
├── package.json
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

git clone <your-repo-url>
cd servicehub

---

### 2️⃣ Backend Setup

cd backend
npm install

---

### 3️⃣ Environment Variables (.env)

Create `.env` file in backend:

PORT=5000
MONGO_URI=mongodb://localhost:27017/servicehub
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

---

### 4️⃣ Run Backend Server

npm start

Server will run on:
http://localhost:5000

---

### 5️⃣ Frontend Setup (if available)

cd frontend
npm install
npm start

---

## 🔗 API Endpoints (Sample)

### Auth Routes:
- POST /api/auth/register
- POST /api/auth/login

### Services:
- GET /api/services
- POST /api/services

### Booking:
- POST /api/bookings

---

## ❗ Common Issues Fix

### MongoDB not connecting
✔ Ensure MongoDB is running  
✔ Check MONGO_URI

### Cloudinary not working
✔ सही API keys डालो

### Admin Panel not working
✔ Role-based authentication check करो

---

## 📸 Future Improvements

- ⭐ Admin Dashboard
- ⭐ Payment Integration
- ⭐ Reviews & Ratings
- ⭐ Live Tracking

---

## 👨‍💻 Author

Kripal Prajapati

---

