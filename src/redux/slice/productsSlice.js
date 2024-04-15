import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import Toast from "../../common/Toast";

const initialState = { products: [], isLoading: false };

export const getProducts = createAsyncThunk(
  "products/api",
  async (state, action) => {
    try {
      //To send empty string to backend is the paramter is undefined
      const category =
        typeof state?.category === "undefined" || !state?.category
          ? ""
          : state?.category;
      const response = await axiosInstance.get("/products", {
        params: { categoryName: category },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const addProduct = createAsyncThunk(
  "addProduct/api",
  async (state, action) => {
    try {
      const response = await axiosInstance.post("/addProduct", state.payload);
      const data = response.data;
      if (data?.status === 200) {
        Toast.success(data?.message?.message);
      } else {
        Toast.success(data?.message?.message);
      }
      return data;
    } catch (error) {
      Toast.error(error?.message);
      throw error;
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload.data;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

const addProductSlice = createSlice({
  name: "addProducts",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

const productsReducer = productsSlice.reducer;

const addProductReducer = addProductSlice.reducer;

export const productsActions = productsSlice.actions;
export const addProductActions = addProductSlice.actions;
export { productsReducer, addProductReducer };
