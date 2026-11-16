import { Router } from "express";
import AuthController from "../controller/auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify-account", AuthController.verifyAccount);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/send-otp", AuthController.sendOtp);

export default router;