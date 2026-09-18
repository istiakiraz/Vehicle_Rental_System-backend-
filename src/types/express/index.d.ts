import { JwtPayload } from "jsonwebtoken";

interface AuthUser extends JwtPayload {
  id: number;
  role: "admin" | "customer";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
