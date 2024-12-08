
export const localStorageKeys = {
	contacts: 'contacts',
	cart: 'cart'
}

export const saveToLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
