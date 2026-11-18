import { Router } from "express";
import authController from "../controller/auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-account", authController.verifyAccount);
router.post("/forget-password", authController.forgetPassword);
router.post("/send-otp", authController.sendOtp);
router.post("/login-with-google", authController.loginWithGoogle);
router.post("/refresh-token", authController.refreshSession);
router.patch("/two-step-verification", authController.twoStepVerification);
router.post("/two-step-verification-login", authController.verify2StepLogin);

export default router;
