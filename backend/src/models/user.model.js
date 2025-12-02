import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// for faster lookups on email
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("users", userSchema);