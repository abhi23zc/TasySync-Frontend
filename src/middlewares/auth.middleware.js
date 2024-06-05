import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
const auth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorized Access"));
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decode) {
      const user = await User.findById(decode.id);
      if (user) {
        req.user = user;
      } else
        return res.status(401).json(new ApiError(401, "Unauthorized Access"));
    }
    console.log(decode);
  } catch (e) {
    next()
  }

  next();
};

export default auth;
