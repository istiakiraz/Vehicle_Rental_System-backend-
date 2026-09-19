import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initDB from "./config/db";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { userRoutes } from "./modules/user/user.routers";
import { bookingRoutes } from "./modules/booking/booking.routers";

const app = express();

// parser incoming JSON requests
app.use(express.json());

// initializing DB
initDB();

// root route
app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental System is running...");
});



// api version
const API_PREFIX = "/api/v1";

// auth route
app.use(`${API_PREFIX}/auth`, authRoutes);

// vehicles route
app.use(`${API_PREFIX}/vehicles`, vehicleRoutes);

// user route
app.use(`${API_PREFIX}/users`, userRoutes);

// bookings rout
app.use(`${API_PREFIX}/bookings`, bookingRoutes);

// <------------- not found route ------------>
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
