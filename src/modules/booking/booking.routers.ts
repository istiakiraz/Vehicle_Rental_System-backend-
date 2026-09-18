import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/authMiddleware";

const router = Router();

router.post("/", auth("admin", "customer"), bookingController.createBooking);

router.get("/", auth("admin", "customer"), bookingController.getAllBooking);

export const bookingRoutes = router;
