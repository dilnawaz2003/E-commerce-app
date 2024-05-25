import userModel from "../models/user.js";
import ErrorHandler from "../utils/custom-error.js";
import { validationResult } from "express-validator";
export const newUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      throw new ErrorHandler(400, "Please Enter Valid Data");

    let { dob, gender } = req.body;
    dob = new Date(dob);
    const userData = { ...req.body, dob };

    const existingUser = await userModel.findById(userData._id);

    if (existingUser) {
      res.json({ success: true, user: existingUser });
    } else {
      if (!gender || !dob) {
        throw new ErrorHandler(400, "Please Enter Valid Data");
      }
      const newUser = await userModel.create(userData);
      res.json({ success: true, user: newUser });
    }
  } catch (e) {
    next(e || new ErrorHandler(400, "Failed To Create New User"));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.json({ success: true, users: users });
  } catch (e) {
    next(e || new ErrorHandler(500, "Failed To get All Users"));
  }
};

export const getUserByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) throw new ErrorHandler(404, "Failed to Get User");

    res.json({ success: true, user: user });
  } catch (e) {
    next(e || new ErrorHandler(500, "Failed To get  User"));
  }
};

export const deleteUserByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) throw new ErrorHandler(500, "Failed to Delete User");

    res.json({ success: true, deletedUser: deletedUser });
  } catch (e) {
    next(e || new ErrorHandler(500, "Failed To Delete  User"));
  }
};
