import "@mantine/core/styles.css";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthenticationForm } from "./components/AuthenticationForm/AuthenticationForm";
import Header from "./components/Header/Header";

function App() {
  return (
    <MantineProvider>
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
        </Routes>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
