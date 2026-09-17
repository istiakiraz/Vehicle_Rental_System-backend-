import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initDB from "./config/db";

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

// <------------- not found route ------------>
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
