import { body } from "express-validator";

export const userValidation = [
  body("email", "Please Enter Valid Email").isEmail(),
  body("name", "Name Must Be At least 6 characters").isLength({ min: 6 }),
  body("photo", "Please Enter Valid Photo").not().isEmpty(),
];

export const productValidation = [
  body("name", "Please Enter Valid Product Name").isLength({ min: 3 }),
  body("price", "Please Enter Valid Price").isFloat({ min: 0 }),
  body("stock", "please Enter Valid Stock").isFloat({ min: 0 }),
  body("category", "please Enter Valid catrgory").not().isEmpty(),
  //   body("photo", "Please Enter Valid Photo").not().isEmpty(),
];
