# ⚡ ServiceHub — Full Stack MERN App

A production-ready platform connecting clients with local service providers.

---

## 📁 Folder Structure

```
servicehub/
├── backend/
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── uploads/         # Local image storage (fallback)
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── common/  # Navbar
    │   │   ├── services/ # ServiceCard
    │   │   └── bookings/ # BookingCard
    │   ├── context/     # AuthContext (JWT state)
    │   ├── pages/       # All page components
    │   ├── utils/       # Axios API helper
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure these are installed on your machine:

| Tool | Download |
|------|----------|
| Node.js v18+ | https://nodejs.org |
| MongoDB Community | https://www.mongodb.com/try/download/community |
| VS Code | https://code.visualstudio.com |
| Git (optional) | https://git-scm.com |

---

## 🚀 Setup Instructions (Windows + VS Code)

### Step 1 — Start MongoDB

Open **Services** (Win+R → `services.msc`) and start **MongoDB**.  
OR run in a terminal:
```
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

### Step 2 — Set Up the Backend

Open a terminal in VS Code (`Ctrl+` ` `):

```bash
cd servicehub/backend
npm install
```

Copy the example env file:
```bash
copy .env.example .env
```

Open `.env` and edit:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/servicehub
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=30d

# Optional: Cloudinary for image uploads
# Get free account at https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** If you skip Cloudinary, images are saved locally in `/backend/uploads/` automatically.

Start the backend:
```bash
npm run dev
```
You should see: `✅ Server running on port 5000` and `✅ MongoDB Connected`

### Step 3 — Set Up the Frontend

Open a **second terminal**:

```bash
cd servicehub/frontend
npm install
npm start
```

The app opens at **http://localhost:3000** 🎉

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Protected | Get current user |

### Services
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/services` | Public | List all services (with filters) |
| GET | `/api/services/:id` | Public | Get single service |
| GET | `/api/services/my-services` | Provider | Get own services |
| POST | `/api/services` | Provider | Create service |
| PUT | `/api/services/:id` | Provider | Update service |
| DELETE | `/api/services/:id` | Provider | Delete service |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | Client | Create booking |
| GET | `/api/bookings/my-bookings` | Client | Get client's bookings |
| GET | `/api/bookings/provider-bookings` | Provider | Get provider's bookings |
| GET | `/api/bookings/:id` | Protected | Get booking detail |
| PUT | `/api/bookings/:id/status` | Provider | Accept/Reject/Complete |
| PUT | `/api/bookings/:id/cancel` | Client | Cancel booking |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| PUT | `/api/users/profile` | Protected | Update profile |
| PUT | `/api/users/change-password` | Protected | Change password |
| GET | `/api/users/provider/:id` | Public | Get provider profile |

---

## 🧪 Test the App

1. Register as a **Provider** → List a service
2. Register as a **Client** (different email) → Browse & book the service
3. Log back in as **Provider** → Accept the booking
4. Log back in as **Client** → View booking status

---

## ❌ Common Errors & Fixes

### `MongoDB connection error`
- Make sure MongoDB service is running
- Check MONGO_URI in `.env` is correct

### `npm install` fails
- Delete `node_modules` and `package-lock.json`, then retry
- Run as Administrator if on Windows

### `Cannot find module 'multer-storage-cloudinary'`
- This is fine — if Cloudinary env vars are missing, the app falls back to local file storage automatically

### `Port 3000 / 5000 already in use`
- Kill the process: `npx kill-port 3000` or `npx kill-port 5000`
- Or change the port in `.env`

### Frontend shows blank page
- Make sure backend is running on port 5000
- Check the `"proxy": "http://localhost:5000"` line in `frontend/package.json`
- Open browser console (F12) and check for errors

### Image upload not working
- Without Cloudinary credentials, images are stored in `backend/uploads/`
- Make sure the `uploads/` folder exists in the backend directory
- Cloudinary is recommended for production

### JWT errors / `Not authorized`
- Clear `localStorage` in browser DevTools → Application → Local Storage
- Log in again

---

## 🌐 Production Deployment Tips

- **Backend**: Deploy to Railway, Render, or VPS. Set all `.env` variables.
- **Frontend**: Run `npm run build` and deploy the `build/` folder to Netlify or Vercel.
- **Database**: Use MongoDB Atlas (free tier) instead of local MongoDB.
- Set `MONGO_URI` to your Atlas connection string.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Images | Cloudinary (or local Multer) |
| Styling | Custom CSS (no UI framework) |

