import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: true,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },

    unSetUser: (state, action) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export { userSlice };
export const { setUser, unSetUser } = userSlice.actions;
