import { Router } from "express";
import authRoutes from "./app/auth/router/route";
const router = Router();

router.use("/auth", authRoutes);

export { router };