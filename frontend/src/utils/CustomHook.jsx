import { useState, useEffect } from "react";

function useLocalStorage (key, initialValue) {

  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return initialValue;
      return JSON.parse(saved);
    } catch (error) {
      return localStorage.getItem(key) || initialValue;
    }
  });

  useEffect(() => {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
