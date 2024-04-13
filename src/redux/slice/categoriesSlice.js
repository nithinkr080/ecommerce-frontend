import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

const initialState = { categories: [], isLoading: false };

export const getCategories = createAsyncThunk(
  "categories/api",
  async (state, action) => {
    try {
      const response = await axiosInstance.get("/categories");
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload.data;
    });
    builder.addCase(getCategories.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

const categoriesReducer = categoriesSlice.reducer;

export const categoriesAction = categoriesSlice.actions;
export default categoriesReducer;
