import mongoose from "mongoose";
import { DATABASE_URI } from "../config";

export const connectDb = async () => {
  console.log("Connecting with URI:", DATABASE_URI);

  const conn = await mongoose.connect(`${DATABASE_URI}`);

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
