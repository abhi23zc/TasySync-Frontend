import { Router } from "express";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import auth from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/getUser", auth, (req, res) => {
  res.status(200).json(new ApiResponse(200, "User", req.user))
});

router.post("/register", async (req, res) => {
  const { fullName, username, password, email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user)
      return res
        .status(401)
        .json(new ApiError(401, "Username or email already exists"));
    const newUser = new User({ fullName, username, password, email });
    await newUser.save();
    return res.status(200).json(new ApiResponse(200, "Success", newUser));
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Error Occured", error));
  }
});

router.post("/login", async (req, res) => {
  const { username, password, email } = req.body;
  console.log(username, password, email)
  try {
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (String(user.password) == String(password)) {
      
      try {
        const token = await user.generateAccessToken();
        res.cookie("token", token, {
          secure:false,
          maxAge: 7 * 24 * 60 * 60 * 1000 ,
          expires: new Date( Date.now() + 3600)
        });
        console.log(token);
        return res.status(200).json(new ApiResponse(200, "Success", token));
      } catch (e) {
        console.log(e);
      }
    } else
      return res
        .status(401)
        .json(new ApiError(401, "Error", "Unauthorized Access"));
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Error Occured", error));
  }
});

router.post("/logout", auth, async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 3600000,
  });
  return res.status(200).json(new ApiResponse(200, "Logged Out Successfully"));
});

export const userRoute = router;
