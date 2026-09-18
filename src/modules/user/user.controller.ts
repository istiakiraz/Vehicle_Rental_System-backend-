import { Request, Response } from "express";
import { userServices } from "./user.services";
const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
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

export const userController = {
  getUser,
};
