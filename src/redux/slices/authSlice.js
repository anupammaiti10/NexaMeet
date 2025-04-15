import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {
    uid: "",
    email: "",
    name: "",
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
    userDetails: (state, action) => {
      // userInfo information based on payload
      state.userDetails = {
        uid: action.payload.uid,
        email: action.payload.email,
        name: action.payload.name,
      };
    },
  },
});

export const { userDetails, changeTheme } = authSlice.actions;
export default authSlice.reducer;
