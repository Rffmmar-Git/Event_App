import * as dotenv from "dotenv";

/* LOAD ENVIRONMENT VARIABLES */
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import eventRoutes from "./routes/eventRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes";

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
app.use("/events", eventRoutes);
app.use("/transactions", transactionRoutes);
app.use("/auth", authRoutes);
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