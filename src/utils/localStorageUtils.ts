import type { Product } from "@/config/products.type";

export const saveToLocalStorage = (key: string, value: Product[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
