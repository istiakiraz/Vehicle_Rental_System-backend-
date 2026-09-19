import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/authMiddleware";

const router = Router();

router.post("/signup", authController.createUser);
router.post("/signin", authController.loginUser);
router.post("/signout", auth("admin", "customer"), authController.signOut);

export const authRoutes = router;
