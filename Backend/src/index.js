import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ConnectDB from "./db/Connect.js";
import router from "./routes/routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect database
ConnectDB();

// Middlewares
app.use(cors({
  origin: "https://billing-system-1-w8vc.onrender.com/", // change to frontend URL later if needed
}));

app.use(express.json());

// Routes
app.use("/api", router);

// Root test route (useful for Render health check)
app.get("/", (req, res) => {
  res.send("Billing System API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});