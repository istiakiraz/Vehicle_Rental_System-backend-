import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/authMiddleware";

const router = Router();

router.get("/", auth("admin"), userController.getUser);
router.put("/:id", auth("admin", "customer"), userController.updateUser);

router.delete("/:id", auth("admin"), userController.deleteUser);


export const userRoute = router;
