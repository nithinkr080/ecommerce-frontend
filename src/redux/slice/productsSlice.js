import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import Toast from "../../common/Toast";

const initialState = { products: [], isLoading: false };

export const getProducts = createAsyncThunk("products/api", async (state) => {
  try {
    //To send empty string to backend is the paramter is undefined
    const category =
      typeof state?.category === "undefined" || !state?.category
        ? ""
        : state?.category;
    const response = await axiosInstance.get("/products", {
      params: { categoryName: category, sellerId: state?.sellerId },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const addProduct = createAsyncThunk("addProduct/api", async (state) => {
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
});

export const deleteProduct = createAsyncThunk(
  "deleteProduct/api",
  async (state) => {
    try {
      const response = await axiosInstance.get("/deleteProduct", {
        params: { productId: state?.productId },
      });
      console.log("response", response);
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

export const removeCartProduct = createAsyncThunk(
  "/cart/remove/api",
  async (state) => {
    console.log("state", state.payload);
    try {
      const response = await axiosInstance.post("/cart/remove", state.payload);
      const data = response.data;
      if (data?.status === 200) {
        Toast.success(data?.message?.message);
      } else {
        Toast.success(data?.message?.message);
      }
      return data;
    } catch (error) {
      console.log("error", error);
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

const deleteProductSlice = createSlice({
  name: "deleteProducts",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProducts.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

//* Reducer
const productsReducer = productsSlice.reducer;
const addProductReducer = addProductSlice.reducer;
const deleteProductReducer = deleteProductSlice.reducer;

//* Actions
export const productsActions = productsSlice.actions;
export const addProductActions = addProductSlice.actions;
export const ProductActions = addProductSlice.actions;

export { productsReducer, addProductReducer, deleteProductReducer };
