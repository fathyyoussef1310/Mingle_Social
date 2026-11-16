import {createApp} from "./app";
import * as http from "node:http";
import mongoose from "mongoose";
import { config } from "./lib/config/env";

const app = createApp()

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`server working on port ${config.port}`)
})
async function shutDown() {
    await mongoose.disconnect()
    server.close()
    process.exit(0)
}

process.on("SIGINT",shutDown)
process.on("SIGTERM",shutDown)