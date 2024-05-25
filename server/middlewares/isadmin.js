import userModel from "../models/user.js";
import ErrorHandler from "../utils/custom-error.js";

const isAdmin = async (req, res, next) => {
  try {
    const { id } = req.query;

    const user = await userModel.findById(id);

    if (!user || user.role !== "Admin") {
      throw new ErrorHandler(
        500,
        "Only Admins are Allowed to perform this action"
      );
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default isAdmin;
