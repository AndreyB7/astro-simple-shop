export const localStorageKeys = {
  cart: 'cart',
  contacts: 'contacts',
} as const;

type LocalStorageError = {
  message: string;
  error: unknown;
};

const isBrowser = typeof window !== 'undefined' && window.localStorage;

const handleLocalStorageError = (operation: string, key: string, error: unknown): LocalStorageError => {
  const message = `Error ${operation} localStorage key "${key}": ${error instanceof Error ? error.message : 'Unknown error'}`;
  console.error(message, error);
  return { message, error };
};

export const saveToLocalStorage = <T>(key: string, value: T): LocalStorageError | undefined => {
  if (!isBrowser) {
    return handleLocalStorageError('saving to', key, new Error('localStorage is not available'));
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return handleLocalStorageError('saving to', key, error);
  }
};

export const getFromLocalStorage = <T>(key: string): { data: T | null; error?: LocalStorageError } => {
  if (!isBrowser) {
    return {
      data: null,
      error: handleLocalStorageError('reading from', key, new Error('localStorage is not available'))
    };
  }
  try {
    const storedValue = localStorage.getItem(key);
    return { data: storedValue ? JSON.parse(storedValue) as T : null };
  } catch (error) {
    return { 
      data: null, 
      error: handleLocalStorageError('reading from', key, error) 
    };
  }
};

export const removeFromLocalStorage = (key: string): LocalStorageError | undefined => {
  if (!isBrowser) {
    return handleLocalStorageError('removing from', key, new Error('localStorage is not available'));
  }
  try {
    localStorage.removeItem(key);
  } catch (error) {
    return handleLocalStorageError('removing from', key, error);
  }
};
