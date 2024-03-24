import { useState } from "react";

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        if (keyName && defaultValue) {
          window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
          return defaultValue;
        }
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (keyName, newValue) => {
    try {
      if (keyName && newValue) {
        window.localStorage.setItem(keyName, JSON.stringify(newValue));
      }
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };
  const clearValue = () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.log("error", error);
    }
  };
  return [storedValue, setValue, clearValue];
};
