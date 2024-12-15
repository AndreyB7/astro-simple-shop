import type { Product } from '@/config/products.type';
import { getFromLocalStorage, localStorageKeys, saveToLocalStorage } from '@/utils/localStorageUtils';
import React, { createContext, useEffect, useState, type ReactNode } from 'react';

type Props = {
	children: ReactNode
}

export type ContactFormData = {
	name: string,
	phone: string,
	email: string,
	address: string,
}

type Cart = Product[]

const initFormData = {
	name: "",
	phone: "",
	email: "",
	address: "",
}
// Create the context
const ShopContext = createContext<{
	cart: Cart,
	formData: ContactFormData,
	setFormData: (formData: ContactFormData) => void
	removeFromCart: (productId: number) => void,
	addToCart: (product: Product) => void,
	handleUpdateQuantity: (id: number, newQuantity: number) => void,
	clearCart: () => void,
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
} | null
>(null);

const ShopProvider = ({ children }: Props) => {
	const [cart, setCart] = useState<Cart>([])
	const [formData, setFormData] = useState<ContactFormData>(initFormData);

	useEffect(() => {
		const storedCart = getFromLocalStorage(localStorageKeys.cart);
		if (storedCart) {
			setCart(storedCart)
		}
		const storedFormData = getFromLocalStorage(localStorageKeys.contacts);
		if (storedFormData) {
			setFormData(storedFormData);
		}
	}, []);

	useEffect(() => {
		saveToLocalStorage<Cart>(localStorageKeys.cart, cart);
	}, [cart]);

	useEffect(() => {
		saveToLocalStorage<ContactFormData>(localStorageKeys.contacts, formData);
	}, [formData]);

	const handleUpdateQuantity = (id: number, newQuantity: number) => {
		setCart((prevCart) =>
			prevCart.map((item) =>
				item.id === id ? { ...item, quantity: newQuantity } : item
			)
		);
	};

	const addToCart = (product: Product) => {
		product.quantity = product.roll ?? 1;
		setCart((prevCart: Product[]) => [...prevCart, product]);
	};

	const removeFromCart = (productId: number) => {
		setCart((prevCart: Product[]) => prevCart.filter((item) => item.id !== productId));
	};

	const clearCart = () => {
		setCart([]);
		localStorage.removeItem(localStorageKeys.cart);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	return (
		<ShopContext.Provider value={{
			cart,
			formData,
			addToCart,
			removeFromCart,
			setFormData,
			handleUpdateQuantity,
			clearCart,
			handleInputChange,
		}}>
			{children}
		</ShopContext.Provider>
	);
};

export { ShopContext, ShopProvider };

