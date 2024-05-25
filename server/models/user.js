import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,

      required: [true, "Please Enter ID"],
    },
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
    },
    email: {
      type: String,
      unique: [true, "Email Already Exist"],
      required: [true, "Please Enter Your Email"],
    },
    photo: {
      type: String,
      required: [true, "Please Enter Your Photo"],
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please Enter Your Gender"],
    },
    dob: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.virtual("age").get(function () {
  const today = new Date();

  const dob = this.dob;

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
});
const userModel = mongoose.model("User", userSchema);

export default userModel;
