import { createApp } from "./app";
import * as http from "node:http";
import mongoose from "mongoose";
import { config } from "./lib/config/env";
import {connectDB} from "./lib/db/connections";

const app = createApp();
const server = http.createServer(app);

async function DbEstablished() {
    try {
        await connectDB();
        server.listen(config.port, () => {
            console.log(`http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

async function shutDown() {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);

DbEstablished();