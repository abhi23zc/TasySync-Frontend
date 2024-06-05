import express from "express";
import { userRoute } from "./routes/user.routes.js";
import cors from "cors";
import { collectionRoute } from "./routes/collection.routes.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());
// app.use(cors())
app.use(express.json());
app.use(cors({ credentials: true, origin: true}));
app.get("/", (req, res) => {
  res.send("API Version 1.0");
});
app.use("/api/v1/users", userRoute);
app.use("/api/v1/tasks", collectionRoute);

export default app;
