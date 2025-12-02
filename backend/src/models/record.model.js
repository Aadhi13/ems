import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// common query patterns
recordSchema.index({ user: 1, date: 1 });
recordSchema.index({ user: 1, type: 1, date: 1 });
recordSchema.index({ user: 1, category: 1, date: 1 });

export default mongoose.model("records", recordSchema);
