# Fresh Check

A modern web application for tracking food freshness using AI-powered image analysis.

## 🚀 Quick Start

### Backend Setup

- **Install dependencies**  
  ```bash
  cd backend && npm install
  ```

- **Environment Setup**  
  Create a `.env` file in the backend directory:
  ```env
  DATABASE_URL=your_neon_database_url_here
  PORT=3000
  ```

- **Run in development**  
  ```bash
  npm run dev
  ```
  Server runs on `http://localhost:3000`

- **Health check**  
  `GET http://localhost:3000/api/health` → `{"status": "OK"}`

- **Database test**  
  `GET http://localhost:3000/api/db-test` → Tests Neon connection

### Frontend Setup

- **Install dependencies**  
  ```bash
  cd frontend/my-app && npm install
  ```

- **Run in development**  
  ```bash
  npm run dev
  ```
  Frontend runs on `http://localhost:5173`

## 📱 Features

- **📸 Item Scanning**: Take photos or upload images for freshness analysis
- **🤖 AI Analysis**: Automatic freshness scoring and days remaining estimation
- **💡 Storage Tips**: Personalized storage recommendations
- **📱 Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **🌙 Dark Mode**: Automatic dark theme support

## 🛠 Tech Stack

### Backend
- **Node.js** with Express
- **Neon PostgreSQL** database
- **Multer** for file uploads
- **CORS** for frontend integration

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Lucide React** for icons
- **Modern CSS** with gradients and animations

## 📁 Project Structure

```
FreshCheck/
├── backend/                 # Node.js API server
│   ├── index.js            # Main server file
│   ├── db.js               # Database connection
│   └── .env                # Environment variables
└── frontend/
    └── my-app/
        ├── src/
        │   ├── pages/      # React components
        │   │   ├── Camera.jsx    # Scan page
        │   │   ├── Dashboard.jsx  # Main dashboard
        │   │   └── Login.jsx      # Authentication
        │   └── components/  # Reusable components
        └── package.json
```

## 🔧 Development

### Running Both Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend/my-app && npm run dev
```

### API Endpoints
- `GET /` - API status
- `GET /api/health` - Health check
- `GET /api/db-test` - Database connection test
- `POST /addEntry` - Analyze item freshness

### Environment Variables
- `DATABASE_URL` - Neon PostgreSQL connection string
- `PORT` - Backend server port (default: 3000)
- `VITE_API_BASE_URL` - Frontend API base URL

## 🎯 Getting Started

1. **Clone and setup backend**
2. **Configure Neon database** and update `.env`
3. **Start backend server**
4. **Setup and start frontend**
5. **Visit `http://localhost:5173`** to use FreshCheck!

## 📄 License

ISC License
