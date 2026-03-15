# Fresh Check

A sophisticated AI-powered web application for food freshness detection using machine learning and Google Gemini integration.

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
  GEMINI_API_KEY=your_google_gemini_api_key
  GOOGLE_CLIENT_ID=your_google_oauth_client_id
  JWT_SECRET=your_jwt_secret
  PORT=3000
  ```

- **Database Setup**  
  ```bash
  npx prisma generate
  npx prisma db push
  ```

- **Run in development**  
  ```bash
  npm run dev
  ```
  Server runs on `http://localhost:3000`

- **Health check**  
  `GET http://localhost:3000/api/health` → `{"status": "OK"}`

### Frontend Setup

- **Install dependencies**  
  ```bash
  cd frontend/my-app && npm install
  ```

- **Environment Setup**  
  Create a `.env` file in the frontend directory:
  ```env
  VITE_API_BASE_URL=http://localhost:3000
  ```

- **Run in development**  
  ```bash
  npm run dev
  ```
  Frontend runs on `http://localhost:5173`

## 📱 Features

- **📸 AI-Powered Scanning**: Camera and photo upload with Google Gemini analysis
- **🤖 Machine Learning**: Custom PyTorch model for fruit spoilage detection
- **🔐 Secure Authentication**: Google OAuth2 with JWT tokens
- **� Database Management**: Prisma ORM with PostgreSQL (Neon)
- **📱 Responsive Design**: Material-UI components with mobile optimization
- **🔍 Real-time Analysis**: Instant freshness scoring and recommendations

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **Database**: Prisma ORM + PostgreSQL (Neon)
- **AI/ML**: Google Generative AI + PyTorch model
- **Authentication**: Google OAuth2 + JWT
- **File Handling**: Multer for image uploads
- **Development**: Nodemon + Prisma Studio

### Frontend
- **React 19** with Vite
- **UI Framework**: Material-UI (MUI) + Emotion
- **Authentication**: Google OAuth integration
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tools**: Vite + ESLint

### Machine Learning
- **Framework**: PyTorch
- **Model**: Custom fruit spoilage detection (45MB)
- **Scripts**: Training, prediction, and dataset management

## 📁 Project Structure

```text
FreshCheck/
├── backend/                    # Node.js API server
│   ├── server.js              # Main Express server (260 lines)
│   ├── .env                   # Environment variables
│   ├── fruit_spoilage_model.pth # ML model (45MB)
│   ├── uploads/               # File upload directory
│   ├── src/                   # Python ML scripts
│   │   ├── model.py           # ML model definition
│   │   ├── predict.py         # Prediction logic
│   │   ├── train.py           # Training script
│   │   └── dataset.py         # Data processing
│   ├── prisma/                # Database schema
│   └── package.json           # Dependencies
└── frontend/
    └── my-app/
        ├── src/
        │   ├── pages/          # React page components
        │   │   ├── Camera.jsx  # Scanning interface
        │   │   ├── Dashboard.jsx # Main dashboard
        │   │   └── Home.jsx    # Landing page
        │   ├── components/     # Reusable UI components
        │   │   ├── Navbar.jsx  # Navigation
        │   │   ├── Layout.jsx  # Page layout
        │   │   └── userContext.jsx # Auth context
        │   └── contexts/      # React contexts
        └── package.json        # Frontend dependencies
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
- `POST /auth/google` - Google OAuth authentication
- `POST /addEntry` - Analyze item freshness with AI
- `GET /api/items` - Get user's scanned items
- `POST /api/items` - Create new item entry

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

### Environment Variables
**Backend:**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `JWT_SECRET` - JWT token secret
- `PORT` - Backend server port (default: 3000)

**Frontend:**
- `VITE_API_BASE_URL` - Backend API URL

## 🎯 Getting Started

1. **Clone repository**
2. **Setup backend** - Install dependencies and configure `.env`
3. **Setup database** - Run Prisma migrations
4. **Configure API keys** - Add Google Gemini and OAuth credentials
5. **Start backend server**
6. **Setup and start frontend**
7. **Visit `http://localhost:5173`** to use FreshCheck!

## 🤖 AI/ML Features

### Custom Model Integration
- **Model**: PyTorch-based fruit spoilage detection
- **Size**: 45MB trained model
- **Integration**: Python scripts called from Node.js
- **Processing**: Image analysis with freshness scoring

### Google Gemini Enhancement
- **Purpose**: Advanced image analysis and natural language processing
- **Features**: Detailed freshness assessment and storage recommendations
- **API**: Google Generative AI integration

## 📄 License

ISC License
