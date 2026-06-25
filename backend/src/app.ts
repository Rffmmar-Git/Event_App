import * as dotenv from "dotenv";

/* LOAD ENVIRONMENT VARIABLES */
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import eventRoutes from "./routes/eventRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes";
import voucherRoutes from "./routes/voucherRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";

/* LOAD CRON JOBS */
import "./utils/cron";

const app = express();

/* MIDDLEWARES */
app.use(cors());
app.use(express.json());

/* SERVE UPLOADED FILES */
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/transactions", transactionRoutes);
app.use("/vouchers", voucherRoutes);
app.use("/reviews", reviewRoutes);
app.use("/analytics", analyticsRoutes);

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* GLOBAL ERROR HANDLER */
app.use(
  (
    err: any,
    req: any,
    res: any,
    next: any
  ) => {
    console.error(
      "GLOBAL ERROR:",
      err
    );

    res.status(500).json({
      message:
        err.message ||
        "Internal server error",
    });
  }
);

/* START SERVER */
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});