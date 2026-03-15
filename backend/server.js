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
app.use(cors({
  origin: true,
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

    console.log(user);

    const email = user.email;
    //const name = user.given_name;

    let dbUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: email,
          firstName: user.given_name || "",
          lastName: user.family_name || ""
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

          const { photo, category, label, count, freshness } = req.body;

          if (label && label.length > 100) {
              return res.status(400).json({ error: "Label is too long (max 100 characters)" });
          }

          const expiry = new Date();
          if(category === "Spoiled");
          else{
            let daysLeft = 7;
            if (2 < freshness && freshness <= 4) daysLeft = 4;
            else if (0 < freshness && freshness <= 2) daysLeft = 2;
            expiry.setDate(expiry.getDate() + daysLeft);
          }

          const shelfLife = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));

          const food = await prisma.food.create({
              data: {
                  userId: user.id,
                  photourl: photo,
                  date: new Date(),
                  label: label || ("temp" + count + "-"+ new Date().getMonth() + new Date().getDate()),
                  category: category,
                  expiryDate: expiry,
                  shelfLife: shelfLife
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
    // const { folderId } = req.query;
    // console.log("id: " + folderId);
    // if (folderId) {
    //   console.log("problem");
    //   const found = await prisma.food.findUnique({
    //     where: { id: parseInt(folderId) },
    //     include: { posts: { orderBy: { id: 'desc' } } }

    //   })
    //   console.log("problem here");
    //   console.log(found);
    //   if (found) {
    //     console.log("a folder has been found");
    //     console.log(found.posts);
    //     return res.status(200).json(found.posts);
    //   }
    // }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // const found = await prisma.food.findMany({
    //     where: { userId: req.user.userId },
    //     skip: (page - 1) * limit,  // how many rows to skip
    //     take: limit,  
    //     orderBy: { shelfLife: 'asc' }
    // })




    if (req.user) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { 
            food: { 
                orderBy: { shelfLife: 'asc' },
                skip: (page - 1) * limit,  // how many rows to skip
                take: limit,  
            },
         },
      });

      if (user) {
        const totalCount = await prisma.food.count({
        where: { userId: req.user.userId },
        });
        const totalPages = Math.ceil(totalCount / limit);
        return res.status(200).json({ items: user.food, totalPages, currentPage: page, totalCount });
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