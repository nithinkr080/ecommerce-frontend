import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser, clearValue] = useLocalStorage("isLoggedIn", null);

  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (keyname, data) => {
    setUser(keyname, data);
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    clearValue();
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
