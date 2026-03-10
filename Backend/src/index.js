import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ConnectDB from "./db/Connect.js";
import router from "./routes/routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "https://billing-system-1-w8vc.onrender.com", // remove trailing slash
}));

app.use(express.json());

// Routes
app.use("/api", router);

// Root route
app.get("/", (req, res) => {
  res.send("Billing System API is running...");
});

// Start server AFTER DB connection
const startServer = async () => {
  try {
    await ConnectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();