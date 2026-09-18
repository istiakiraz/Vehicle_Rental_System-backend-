import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import config from "../config";
import { AuthUser } from "../types/express";

const auth = (...roles: AuthUser["role"][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "No token provided",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Invalid authorization header",
        });
      }

      const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed!",
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};
