import { configureStore } from "@reduxjs/toolkit";
import {
  categoriesReducer,
  productsReducer,
  signInReducer,
  signUpReducer,
} from "./slice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    signIn: signInReducer,
    signUp: signUpReducer,
  },
});

export default store;
