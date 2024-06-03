import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Customer/Home/Home";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthenticationForm } from "./components/AuthenticationForm/AuthenticationForm";
import Header from "./components/Customer/Header/Header";
import Cart from "./components/Customer/Cart/Cart";
import { Notifications } from "@mantine/notifications";
import { useLocalStorage } from "./hooks/useLocalStorage";
import SellerHome from "./components/Seller/SellerHome/SellerHome";
import SellerHeader from "./components/Seller/SellerHeader/SellerHeader";
import AddProduct from "./components/Seller/AddProduct/AddProduct";
import Checkout from "./components/Customer/Checkout/Checkout";
import Orders from "./components/Customer/Orders/Orders";

function App() {
  const location = useLocation();
  const [role] = useLocalStorage("role", null);

  const theme = createTheme({
    colors: {
      lightBlack: ["#3B3B3B", "#313131", "#272727", "#1D1D1D"],
      default: ["#21a3bf"],
      defaultLight: ["#aef1ff"],
    },
    fontSmoothing: false,
  });

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <AuthProvider>
        {location.pathname !== "/login" ? (
          role == "Customer" ? (
            <Header />
          ) : (
            <SellerHeader />
          )
        ) : null}
        <Routes>
          <Route path="/login" element={<AuthenticationForm />} />
          {role == "Customer" ? (
            <>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />{" "}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <SellerHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addProduct"
                element={
                  <ProtectedRoute>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
            </>
          )}
        </Routes>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
