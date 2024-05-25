import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useNewUserMutation } from "../redux/api/user-api";

const Login = () => {
  const [gender, setGender] = useState();
  const [dob, setDOB] = useState();
  const [isLoading, setISLoading] = useState(false);
  const [login] = useNewUserMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    try {
      setISLoading(true);
      e.preventDefault();
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const { uid: _id, displayName: name, email, photoURL: photo } = user;

      const response = await login({
        _id,
        name,
        email,
        photo,
        gender,
        dob,
      });

      if (response.error) {
        const errorMessage = response.error.data.message;
        throw new Error(errorMessage || "Login Failed Please Try Again");
      }

      toast.success(`you are successfuly logedin`);

      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setISLoading(false);
    }
  };

  return (
    <div className="p-6 py-14 mt-[100px]   rounded-md sm:max-w-sm md:max-w-md m-auto  flex flex-col items-center  justify-center gap-3 shadow-2xl  ">
      <h1 className="uppercase text-gray-400 text-3xl ">L O G I N</h1>
      <form className="w-full p-4" onSubmit={submitHandler}>
        <div className="flex flex-col gap-1 w-full mb-2">
          <label>Gender</label>
          <select
            className="border-2 border-gray-400 outline-none rounded-sm p-1"
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Choose Gender</option>
            <option value="male">Male</option>
            <option value="female">FeMale</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Date of birth</label>
          <input
            type="date"
            className="border-2 border-gray-400 outline-none rounded-sm p-1"
            onChange={(e) => setDOB(e.target.value)}
          ></input>
        </div>
        <div className=" flex flex-col items-center gap-y-2 mt-4">
          <p className="text-gray-400">Already Signd in Once</p>
          {isLoading ? (
            <h1>Loading....</h1>
          ) : (
            <button className="bg-blue-500 rounded-sm text-white py-1 px-2 flex items-center gap-2">
              <span>{<FaGoogle />}</span>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
