import express from "express"
const app = express()

import cors from "cors"
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
import cookieParser from "cookie-parser";
app.use(cookieParser())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true })) //, limit: "16kb"
app.use(express.json());

// import path from 'path';
// Serve static files from the 'public' directory
app.use(express.static('../public'));

import session from 'express-session';
app.use(session({
    secret: 'GfEdCbAaBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    },
}));

import UserRouter from './routes/user.routes.js';
app.use("", UserRouter)

import categoryrouter from './routes/admin/category.routes.js'
app.use(categoryrouter)

import productrouter from './routes/admin/product.routes.js'
app.use(productrouter)
export { app }
