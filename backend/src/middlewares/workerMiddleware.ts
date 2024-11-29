import { NextFunction, Request, Response } from "express";
import { JWT_SECRET, WORKER_JWT_SECRET } from "..";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string; // Optional userId
}

export function workerMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return; // End the function to avoid falling through
  }

  const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer'

  if (!token) {
    res.status(401).json({ message: "Malformed authorization header" });
    return;
  }

  try {
    const decoded = jwt.verify(token, WORKER_JWT_SECRET) as { userId: string };

    if (decoded.userId) {
      req.userId = decoded.userId; // Attach userId
      next(); // Proceed to next middleware
    } else {
      res.status(403).json({ message: "You are not logged in" });
    }
  } catch (e) {
    res.status(403).json({ message: "Invalid token" });
  }
}
