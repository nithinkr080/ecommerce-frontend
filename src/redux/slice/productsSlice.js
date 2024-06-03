import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import Toast from "../../common/Toast";

const initialState = { products: [], isLoading: false };

const initalOrdersSlice = { orders: [] };

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
      Toast.error(data?.message?.message);
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
        Toast.error(data?.message?.message);
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
    try {
      const response = await axiosInstance.post("/cart/remove", state.payload);
      const data = response.data;
      if (data?.status === 200) {
        Toast.success(data?.message?.message);
      } else {
        Toast.error(data?.message?.message);
      }
      return data;
    } catch (error) {
      console.log("error", error);
      Toast.error(error?.message);
      throw error;
    }
  }
);

export const orderProduct = createAsyncThunk(
  "/order/product/api",
  async (state) => {
    try {
      const response = await axiosInstance.post("/update/order", state);
      const data = response.data;
      if (data?.status === 200) {
        Toast.success(data?.message?.message);
      } else {
        Toast.error(data?.message?.message);
      }
      return data;
    } catch (error) {
      console.log("error", error);
      Toast.error(error?.message);
      throw error;
    }
  }
);

export const getOrders = createAsyncThunk("/orders/api", async (state) => {
  try {
    const response = await axiosInstance.get("/orders", {
      params: { userId: state?.userId },
    });
    const data = response.data;
    if (data?.status !== 200) throw new Error(data?.message?.message);
    return data;
  } catch (error) {
    Toast.error(error?.message);
  }
});

export const cancelOrder = createAsyncThunk("/cancel/api", async (state) => {
  try {
    const response = await axiosInstance.get("/cancel/order", {
      params: { userId: state?.userId, orderId: state?.orderId },
    });
    const data = response.data;
    if (data?.status !== 200) throw new Error(data?.message?.message);
    return data;
  } catch (error) {
    Toast.error(error?.message);
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    searchProduct(state, action) {
      state.products = action.payload;
    },
  },
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

const orderSlice = createSlice({
  name: "getOrders",
  initialState: initalOrdersSlice,
  extraReducers: (builder) => {
    builder.addCase(getOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = JSON.parse(action.payload.data);
    });
    builder.addCase(getOrders.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

//* Reducer
const productsReducer = productsSlice.reducer;
const addProductReducer = addProductSlice.reducer;
const deleteProductReducer = deleteProductSlice.reducer;
const ordersReducer = orderSlice.reducer;

//* Actions
export const productsActions = productsSlice.actions;
export const addProductActions = addProductSlice.actions;
export const ProductActions = addProductSlice.actions;
export const ordersActions = ordersReducer.actions;

export {
  productsReducer,
  addProductReducer,
  deleteProductReducer,
  ordersReducer,
};
