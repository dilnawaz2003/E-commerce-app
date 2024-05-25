import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./routes/admin-routes";
import UserRoutes from "./routes/user-routes";

import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./Components/protected-route";
import { auth } from "./firebase";
import { getUser } from "./redux/api/user-api";
import { setUser, unSetUser } from "./redux/reducer/user-slice";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.userSlice);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // const userFromDB = getUser(user.uid);
        const userFromDB = await getUser(user.uid);

        if (userFromDB) {
          dispatch(setUser(userFromDB));
        }
      } else {
        dispatch(unSetUser());
      }
    });
  }, []);
  if (loading) return <h1>Loading....</h1>;
  return (
    <React.Fragment>
      <Toaster></Toaster>
      <Routes>
        {/*  USER ROUTES */}
        <Route path="/*" element={<UserRoutes />}></Route>
        {/* ADMIN ROUTES */}
        <Route
          element={
            <ProtectedRoute
              isAdmin={user && user.role === "Admin" ? true : false}
              isAdminRoute={true}
              isAuthenticated={user ? true : false}
            />
          }
        >
          <Route path="/admin/*" element={<AdminRoutes />}></Route>
        </Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
