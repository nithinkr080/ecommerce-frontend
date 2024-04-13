import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import Toast from "../../common/Toast";

export const signIn = createAsyncThunk("signIn/api", async (state) => {
  try {
    const response = await axiosInstance.post("/signIn", {
      emailId: state.emailId,
      password: state.password,
    });
    Toast.success(response?.data?.message?.message);
    return response.data;
  } catch (error) {
    Toast.error(error?.message);
    throw error;
  }
});

export const signUp = createAsyncThunk("signUp/api", async (state) => {
  try {
    const response = await axiosInstance.post("/signUp", {
      username: state.username,
      emailId: state.emailId,
      password: state.password,
      role: state.role,
    });
    Toast.success(response?.data?.message?.message);
    return response.data;
  } catch (error) {
    Toast.error(error?.message);
    throw error;
  }
});

const signInSlice = createSlice({
  name: "signIn",
  initialState: {},
});

const signUpSlice = createSlice({
  name: "signUp",
  initialState: {},
});

export const signInReducer = signInSlice.reducer;
export const signUpReducer = signUpSlice.reducer;
export const signInActions = signInSlice.actions;
export const signUpActions = signUpSlice.actions;
