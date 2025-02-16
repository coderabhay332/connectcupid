import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export default function middleware(req, res, next) {
    try {
      const token = req.header("Authorization");
      if (!token) return res.status(403).send("Access denied.");
  
      const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).send("Invalid token");
    }
  }