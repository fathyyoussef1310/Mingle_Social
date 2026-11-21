import mongoose from "mongoose";
import { config } from "../config/env";

export async function connectDB(): Promise<void> {
    await mongoose.connect(config.db.url, {
        serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
}