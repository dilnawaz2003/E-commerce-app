import express from "express";
import isAdmin from "../middlewares/isadmin.js";
import { userValidation } from "../utils/validations.js";

import {
  getAllUsers,
  newUser,
  getUserByID,
  deleteUserByID,
} from "../controllers/user.js";

const router = express.Router();

router.post("/new", userValidation, newUser);

router.get("/all", isAdmin, getAllUsers);

router.get("/:id", getUserByID);

router.delete("/:id", isAdmin, deleteUserByID);

export default router;
