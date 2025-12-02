import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const DB = process.env.MONGO_URI;

const connectDB = async () => {
  await mongoose.connect(DB);
  console.log("MongoDB connected");
};

export default connectDB;
