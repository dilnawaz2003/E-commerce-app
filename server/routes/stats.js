import express from "express";
import isAdmin from "../middlewares/isadmin.js";
import {
  getBarChartsStats,
  getDashboardStats,
  getLineChartsStats,
  getPieChartsStats,
} from "../controllers/stats.js";

const app = express.Router();

app.get("/dashboard-stats", isAdmin, getDashboardStats);

app.get("/admin-pie", isAdmin, getPieChartsStats);
app.get("/admin-bar", isAdmin, getBarChartsStats);
app.get("/admin-line", isAdmin, getLineChartsStats);

export default app;
