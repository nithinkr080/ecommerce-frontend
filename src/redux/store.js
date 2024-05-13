import { configureStore } from "@reduxjs/toolkit";
import {
  addProductReducer,
  categoriesReducer,
  deleteProductReducer,
  productsReducer,
  signInReducer,
  signUpReducer,
} from "./slice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    addProducts: addProductReducer,
    categories: categoriesReducer,
    signIn: signInReducer,
    signUp: signUpReducer,
    deleteProduct: deleteProductReducer,
  },
});

export default store;
