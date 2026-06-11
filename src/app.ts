import express from "express";
import authRouter from "./modules/auth/auth.routes";
import hotelRouter from "./modules/hotels/hotels.routes";
import bookingRouter from "./modules/bookings/bookings.routes";
import { isAuthenticated } from "./shared/middleware/authMiddleware";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/hotels", isAuthenticated, hotelRouter);
app.use("/api/bookings", isAuthenticated, bookingRouter);

export default app;
