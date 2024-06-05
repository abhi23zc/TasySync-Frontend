import dotenv from "dotenv";
import db from "./src/config/db.config.js";
import app from "./src/app.js";

dotenv.config();
db().catch((err) => console.log(err));
const port = 80 || process.env.PORT
app.listen(port, () => {
  console.log("server is running on port 80");
});
