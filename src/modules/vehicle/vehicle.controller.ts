import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

// create vehicle
const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get vehicles
const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicle();

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message,
      details: err,
    });
  }
};

// get single vehicle
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicle(
      req.params.id as string,
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message,
      details: err,
    });
  }
};

// update vehicle
const updateVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehicleServices.updateVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      req.params.id as string,
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: " vehicle data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message,
      details: err,
    });
  }
};

// delete vehicle
const deleteVehicle = async (req: Request, res: Response) => {
  const result = await vehicleServices.deleteVehicle(req.params.id as string);

   try {
    if (result.rowCount === 0) {
      res.status(400).json({
        success: false,
        message: "Booked vehicles cannot be deleted",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message,
      details: err,
    });
  }


};

export const vehicleController = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
};
