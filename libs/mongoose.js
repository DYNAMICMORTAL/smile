import mongoose from "mongoose";
import User from "../models/User";

const connectMongo = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Add the MONGODB_URI environment variable inside .env.local to use mongoose"
    );
  }
  const uri = 'mongodb+srv://aminvasudev6:wcw9QsKgW3rUeGA4@waybillcluster.88jnvsg.mongodb.net/?retryWrites=true&w=majority&appName=waybillCluster';
  return mongoose
    .connect(uri)
    .catch((e) => console.error("Mongoose Client Error: " + e.message));
};

export default connectMongo;
