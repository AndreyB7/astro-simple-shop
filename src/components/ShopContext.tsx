import type { Product } from '@/config/products.type';
import { getFromLocalStorage, localStorageKeys, removeFromLocalStorage, saveToLocalStorage } from '@/utils/localStorageUtils';
import React, { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

type Props = {
	children: ReactNode;
}

export type ContactFormData = {
	name: string;
	phone: string;
	email: string;
	address: string;
}

type Cart = Product[];

interface ShopContextType {
	cart: Cart;
	formData: ContactFormData;
	setFormData: (formData: ContactFormData) => void;
	removeFromCart: (productId: number) => void;
	addToCart: (product: Product) => void;
	handleUpdateQuantity: (id: number, newQuantity: number) => void;
	clearCart: () => void;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const initFormData: ContactFormData = {
	name: "",
	phone: "",
	email: "",
	address: "",
};

export const ShopContext = createContext<ShopContextType | null>(null);

export const ShopProvider = ({ children }: Props) => {
	const [cart, setCart] = useState<Cart>(() => {
		const { data, error } = getFromLocalStorage<Cart>(localStorageKeys.cart);
		if (error) {
			console.warn('Failed to load cart from localStorage:', error.message);
		}
		return data || [];
	});

	const [formData, setFormData] = useState<ContactFormData>(() => {
		const { data, error } = getFromLocalStorage<ContactFormData>(localStorageKeys.contacts);
		if (error) {
			console.warn('Failed to load contacts from localStorage:', error.message);
		}
		return data || initFormData;
	});

	useEffect(() => {
		const error = saveToLocalStorage(localStorageKeys.cart, cart);
		if (error) {
			console.warn('Failed to save cart to localStorage:', error.message);
		}
	}, [cart]);

	useEffect(() => {
		const error = saveToLocalStorage(localStorageKeys.contacts, formData);
		if (error) {
			console.warn('Failed to save contacts to localStorage:', error.message);
		}
	}, [formData]);

	const handleUpdateQuantity = useCallback((id: number, newQuantity: number) => {
		if (newQuantity < 0) return;
		setCart(prevCart =>
			prevCart.map(item =>
				item.id === id ? { ...item, quantity: newQuantity } : item
			)
		);
	}, []);

	const addToCart = useCallback((product: Product) => {
		if (!product || typeof product.id !== 'number') {
			console.error('Invalid product:', product);
			return;
		}
		setCart(prevCart => {
			const existingProduct = prevCart.find(item => item.id === product.id);
			if (existingProduct) {
				return prevCart.map(item =>
					item.id === product.id
						? { ...item, quantity: (item.quantity || 1) + 1 }
						: item
				);
			}
			return [...prevCart, { ...product, quantity: product.roll ?? 1 }];
		});
	}, []);

	const removeFromCart = useCallback((productId: number) => {
		setCart(prevCart => prevCart.filter(item => item.id !== productId));
	}, []);

	const clearCart = useCallback(() => {
		setCart([]);
		const error = removeFromLocalStorage(localStorageKeys.cart);
		if (error) {
			console.warn('Failed to clear cart from localStorage:', error.message);
		}
	}, []);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	}, []);

	const contextValue = useMemo(() => ({
		cart,
		formData,
		addToCart,
		removeFromCart,
		setFormData,
		handleUpdateQuantity,
		clearCart,
		handleInputChange,
	}), [cart, formData, addToCart, removeFromCart, handleUpdateQuantity, clearCart, handleInputChange]);

	return (
		<ShopContext.Provider value={contextValue}>
			{children}
		</ShopContext.Provider>
	);
};
