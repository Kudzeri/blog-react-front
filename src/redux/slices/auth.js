import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { Logout } from "@mui/icons-material";

export const fetchUserData = createAsyncThunk(
  "/auth/fetchUserData",
  async (params) => {
    const { data } = await axios.post("/login", params);

    return data;
  }
);

export const fetchUserRegister = createAsyncThunk(
  "/auth/fetchUserRegister",
  async (params) => {
    const { data } = await axios.post("/register", params);

    return data;
  }
);

export const fetchUserProfile = createAsyncThunk(
  "/auth/fetchUserProfile",
  async () => {
    const { data } = await axios.get("/profile");

    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchUserData.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchUserData.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchUserData.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchUserProfile.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchUserProfile.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchUserProfile.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchUserRegister.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchUserRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchUserRegister.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
  },
});

export const isAuthSelector = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
