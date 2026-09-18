import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initDB from "./config/db";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { userRoute } from "./modules/user/user.routers";
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

// auth route
app.use("/api/v1/auth", authRoutes);

// vehicles route
app.use("/api/v1/vehicles", vehicleRoutes);

// user route
app.use("/api/v1/users", userRoute);

// bookings route

app.use("/api/v1/bookings", bookingRoutes);

// <------------- not found route ------------>
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
