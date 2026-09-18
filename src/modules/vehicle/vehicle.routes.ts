import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/authMiddleware";

const router = Router();

router.post("/", auth("admin"), vehicleController.createVehicle);

router.get("/", vehicleController.getVehicle);
router.get("/:id", vehicleController.getSingleVehicle);

router.put("/:id", auth("admin"), vehicleController.updateVehicle);

router.delete("/:id", auth("admin"), vehicleController.deleteVehicle);

export const vehicleRoutes = router;
