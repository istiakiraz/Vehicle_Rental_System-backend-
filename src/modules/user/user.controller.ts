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

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { name, email, phone, role } = req.body;

    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const isAdmin = loggedInUser.role === "admin";

    // customer can update only own profile

    if (!isAdmin && loggedInUser.id !== Number(id)) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own profile",
      });
    }

    // customer cannot update role
    if (!isAdmin && role !== undefined) {
      return res.status(403).json({
        success: false,
        message: "Customers cannot change role",
      });
    }

    const result = await userServices.updateUser(
      name,
      email,
      phone,
      role,
      id as string,
      isAdmin,
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: null,
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

export const userController = {
  getUser,
  updateUser,
  deleteUser,
};
