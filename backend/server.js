import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./src/routes/user.routes.js";
const app = express();
import errorHandler from "./src/middleware/errorHandler.js";
const PORT = process.env.PORT;

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);