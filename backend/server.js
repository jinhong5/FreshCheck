require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const app = express();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cors = require("cors");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.use(express.json({ limit: '50mb' }));

// console.log(process.env.DATABASE_URL);

//middleware to authenticate a jwt token
function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.sendStatus(401);

    const token = header.split(" ")[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.sendStatus(401);
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

            const { photo } = req.body;

            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);

            const food = await prisma.food.create({
                data: {
                    userId: user.id,
                    photourl: photo,
                    date: new Date(),
                    label: "Apple-031426",
                    category: "fresh",
                    expiryDate: expiry
                }
            })

            // TODO: replace this mock analysis with real AI model output.
            const freshnessScore = 82; // 0–100
            const daysRemaining = 3;
            const storageTips = [
                "Store in the crisper drawer to keep humidity stable.",
                "Keep away from ethylene-sensitive produce to slow ripening.",
                "Use within the next few days for best quality."
            ];

            return res.status(201).json({
                message: "New entry added",
                entry: {
                    id: food.id,
                    label: food.label,
                    category: food.category,
                    expiryDate: food.expiryDate
                },
                analysis: {
                    freshnessScore,
                    daysRemaining,
                    storageTips
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
        console.log("id: " + folderId);
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


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})