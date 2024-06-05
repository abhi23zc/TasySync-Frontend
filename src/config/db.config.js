import mongoose from "mongoose";
import 'dotenv/config'
async function db() {
  console.log(process.env.MONGO_DB_URL)
  await mongoose.connect(process.env.MONGO_DB_URL);
  console.log("Database connected Successfully");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
export default db;
