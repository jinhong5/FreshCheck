require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const { spawn } = require("child_process");
const multer = require("multer");

const express = require("express");
const app = express();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cors = require("cors");

const upload = multer({ dest: "uploads/" });

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const isDev = process.env.NODE_ENV !== "production";
app.use(cors({
  origin: isDev ? true : (origin, cb) => {
    const allowed = [
      FRONTEND_URL,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ];
    if (!origin || allowed.some(url => origin === url)) return cb(null, true);
    if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) return cb(null, true);
    return cb(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.use(express.json({ limit: '50mb' }));

// console.log(process.env.DATABASE_URL);

//middleware to authenticate a jwt token
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Unauthorized", message: "Please sign in again." });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized", message: "Please sign in again." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized", message: "Please sign in again." });
  }
}

app.get('/user/me', auth, async (req, res) => {
  try {
    if (req.user) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { firstName: true }
      })
      return res.status(200).json({ firstName: user.firstName });
    }
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.post('/auth/google', async (req, res) => {
  try {

    const { user } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({ error: "Invalid Google user data" });
    }

    const email = user.email;
    const name = user.name;

    let dbUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: email,
          firstName: name
        }
      });
    }

    const token = jwt.sign(
      { userId: dbUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/addEntry", auth, async (req, res) => {
    try {
      if (req.user) {
          const user = await prisma.user.findUnique({
              where: { id: req.user.userId }
          })

          const { photo, category, label, count } = req.body;

          if (label && label.length > 100) {
              return res.status(400).json({ error: "Label is too long (max 100 characters)" });
          }

          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 7);

          const food = await prisma.food.create({
              data: {
                  userId: user.id,
                  photourl: photo,
                  date: new Date(),
                  label: label || ("temp" + count + "-"+ new Date().getMonth() + new Date().getDate()),
                  category: category,
                  expiryDate: expiry
              }
          })

          return res.status(201).json({
              message: "New entry added",
              entry: {
                  id: food.id,
                  label: food.label,
                  category: food.category,
                  expiryDate: food.expiryDate
              }
          });
      }
    }
    catch (err) {
      console.error("Error creating food:", err);
      return res.status(500).json({ error: err.message });
    }
})

app.get('/inventory', auth, async (req, res) => {
  try {
    const { folderId } = req.query;
    // console.log("id: " + folderId);
    if (folderId) {
      console.log("problem");
      const found = await prisma.food.findUnique({
        where: { id: parseInt(folderId) },
        include: { posts: { orderBy: { id: 'desc' } } }

      })
      console.log("problem here");
      console.log(found);
      if (found) {
        console.log("a folder has been found");
        console.log(found.posts);
        return res.status(200).json(found.posts);
      }
    }


    if (req.user) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { food: { orderBy: { id: 'desc' } } }
      })
      if (user) {
        return res.status(200).json(user.food);
      }
      else {
        return res.status(404).json({ error: "User not found" });
      }
    }

  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.post("/predict", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;

  const python = spawn("python", ["src/predict.py", imagePath]);

  let data = "";

  python.stdout.on("data", (chunk) => {
    data += chunk.toString();
  });

  python.stderr.on("data", (err) => {
    console.error("PYTHON ERROR:", err.toString());
  });

  python.on("close", () => {
    res.json(JSON.parse(data));
  });


});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})