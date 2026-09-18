import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/authMiddleware";

const router = Router();

router.post("/", auth("admin", "customer"), bookingController.createBooking);

export const bookingRoutes = router;
