import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthenticationForm } from "./components/AuthenticationForm/AuthenticationForm";
import Header from "./components/Header/Header";
import Cart from "./components/Cart/Cart";
import { Notifications } from "@mantine/notifications";

function App() {
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
        <Header />
        <Routes>
          <Route path="/login" element={<AuthenticationForm />} />
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
        </Routes>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
