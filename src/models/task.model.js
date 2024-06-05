import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default:new Date
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
  },
});

export const Task = mongoose.model("Task", taskSchema);
