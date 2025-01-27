import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {
    uid: undefined,
    email: undefined,
    name: undefined,
  },
  isDarkTheme: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.isDarkTheme = action.payload.isDarkTheme; // Update theme based on payload
    },
    setUser: (state, action) => {
      // Set user information based on payload
      state.userInfo = {
        uid: action.payload.uid,
        email: action.payload.email,
        name: action.payload.name,
      };
    },
  },
});

export const { setUser, changeTheme } = authSlice.actions;
export default authSlice.reducer;
