import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    share: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.method("generateAccessToken", async function (next) {
  const token = jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600000,
  });
  return token;
});

export const User = mongoose.model("User", userSchema);
