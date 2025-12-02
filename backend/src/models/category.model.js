import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["expense", "income", "both"],
      required: true,
    },

    // null or undefined means global default category
    // if set, category belongs only to that user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
  },
  { timestamps: true }
);

categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

export default mongoose.model("categories", categorySchema);