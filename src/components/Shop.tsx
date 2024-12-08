import type { Product, ProductsData } from '@/config/products.type';
import CartIcon from '@/icons/commons/CartIcon';
import CloseIcon from "@/icons/commons/CloseIcon";
import { getFromLocalStorage, localStorageKeys, saveToLocalStorage } from "@/utils/localStorageUtils.ts";
import { countProductTotal, currencyFormat } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';


type Props = {
	products: ProductsData
}

type FormData = {
	name: string,
	phone: string,
	email: string,
	address: string,
}

const productButton = 'uppercase px-3 py-1 text-sm md:text-base bg-gradient-to-b from-primary to-secondary md:px-6 md:py-2 rounded-lg text-center font-semibold hover:opacity-85 transition inline-block';
const productButtonSelected = 'uppercase px-3 py-1 text-sm md:text-base bg-gradient-to-b from-green-800 to-green-700 md:px-6 md:py-2 rounded-lg text-center font-semibold hover:opacity-85 transition inline-block';

const Shop = ({ products }: Props) => {
	const [cart, setCart] = useState<Product[]>(() => []);

	const [cartOpen, setCartOpen] = useState<boolean>(false);
	const toggleCart = () => setCartOpen((prev) => !prev);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isHasMessage, setIsHasMessage] = useState('')
	const [formData, setFormData] = useState<FormData>({
		name: "",
		phone: "",
		email: "",
		address: "",
	});
	const toggleForm = () => setIsFormOpen((prev) => !prev);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const cartTotal = cart.reduce((sum: number, cartItem) => {
		return sum + countProductTotal(cartItem);
	}, 0);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data: {
			cart: {
				name: string,
				quantity?: number,
				productTotal: number,
			}[];
			total: number;
			formData: FormData;
		} = {
			cart: cart.map(cartItem => ({
				name: cartItem.name,
				quantity: cartItem.quantity,
				productTotal: countProductTotal(cartItem)
			})),
			total: cartTotal,
			formData
		};

		try {
			const response = await fetch("https://aliasevpro.ru/orderHandler.php", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();

			if (response.ok) {
				const responseMesssage = responseData.message || "Заяквка отправлена, мы свяжемся с вами в ближайшее время!";
				setIsHasMessage(responseMesssage);
				saveToLocalStorage<string>(localStorageKeys.contacts, JSON.stringify(formData));
				setIsFormOpen(false);
			} else {
				setIsHasMessage(responseData.message || "Ошибка обработки заказа, пожалуста свяжитесь с нами по телефону");
			}
		} catch (error) {
			console.error("Error submitting the form:", error);
			alert("Ошибка отправки заказа, пожалуста проверте подключение к интернету или свяжитесь с нами по телефону");
		}
	};

	useEffect(() => {
		const storedCart = getFromLocalStorage(localStorageKeys.cart);
		if (storedCart) {
			setCart(storedCart);
		}
		const storedFormData = getFromLocalStorage(localStorageKeys.contacts);
		if (storedFormData) {
			setFormData(JSON.parse(storedFormData));
		}
	}, []);


	// Save to local storage whenever cart changes
	useEffect(() => {
		saveToLocalStorage<Product[]>(localStorageKeys.cart, cart);
	}, [cart]);

	const addToCart = (product: Product) => {
		product.quantity = product.roll ?? 1;
		setCart((prevCart: Product[]) => [...prevCart, product]);
	};

	const handleUpdateQuantity = (id: number, newQuantity: number) => {
		setCart((prevCart) =>
			prevCart.map((item) =>
				item.id === id ? { ...item, quantity: newQuantity } : item
			)
		);
	};

	const removeFromCart = (productId: number) => {
		setCart((prevCart: Product[]) => prevCart.filter((item) => item.id !== productId));
	};

	const clearCart = () => {
		setCart([]);
		localStorage.removeItem(localStorageKeys.cart);
	};

	return (
		<>
			<div className="flex justify-center flex-col items-center">
				<div className={'w-full max-w-xl p-2 px-4 rounded-2xl bg-gray-700 text-center my-4'}>
					Оформление заказа с сайта находится в разработке, для оформления свяжитесь по телефону или напишите сообщение в Телеграм
					<div className={'grid justify-center p-2 m-1'}>
						<a className={'m-1 ' + productButton} href={'tel:+79955702014'} target='_blank'>+7 (995) 570-20-14</a>
						<a className={'m-1 ' + productButton} href={'https://telegram.me/aliasevpro'} target='_blank'>Сообщение Телеграм</a>
					</div>
				</div>
			</div>
			<div className='grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-y-5 md:gap-x-5 place-items-center'>
				{products.map(p => {
					const isInCart = cart.some(cp => p.id === cp.id);
					return (
						<div key={p.id} className='flex flex-col border border-gray-700 rounded-2xl w-full h-full text-center'>
							<div className='w-full relative flex pb-[61%] h-0'>
								<img src={`/products/${p.img}`} alt={p.name}
									className="rounded-t-2xl object-cover w-full h-full absolute" />
							</div>
							<div className='p-2 md:p-4 flex flex-col flex-grow justify-self-stretch w-full'>
								<div className='text-lg font-semibold'>{p.name}</div>
								{p.desc && <div className='opacity-50 text-sm'>{p.desc}</div>}
								<div>
									<hr />
								</div>
								<div className='mt-2 flex flex-col h-full justify-end'>
									<div className='mb-2'>
										{p.priceroll && (<div>
											<div>Цена за ролик {p.roll + 'мп'}:</div>
											<div className='text-xl font-bold'>{currencyFormat(p.priceroll)}</div>
										</div>)}
										{p.price && (<div>
											<div>Цена {p.roll && 'за мп'}</div>
											<div className='text-xl font-bold'>{currencyFormat(p.price)}</div>
										</div>)}
									</div>
									{isInCart ?
										<button onClick={() => removeFromCart(p.id)}
											className={productButtonSelected}>
											{'Выбран'}
										</button> :
										<button onClick={() => addToCart(p)}
											className={productButton}>
											{'Выбрать'}
										</button>
									}
								</div>
							</div>
						</div>
					)
				}
				)}
			</div>
			{cart.length >= 1 &&
				<button
					onClick={toggleCart}
					className="fixed z-30 w-10 h-10 bottom-4 right-4 transform bg-blue-500 text-white p-2 rounded-xl shadow-lg hover:bg-blue-600 focus:outline-none"
				>
					<div className='absolute min-w-5 -top-2 -right-2 bg-red-500 px-1 rounded-full text-sm'>{cart.length}</div>
					<CartIcon />
				</button>}
			<div
				className={`fixed z-30 inset-x-0 bottom-0 transform flex flex-col justify-center transition-transform ${cartOpen ? "translate-y-0" : "translate-y-full"
					} bg-gray-700 shadow-lg rounded-t-xl p-4`}
			>
				<div className='flex justify-end absolute top-1 right-1'>
					<button
						onClick={toggleCart}
						className="bg-red-500 max-w-8 text-white p-1 rounded-lg hover:bg-red-600"
					>
						<CloseIcon />
					</button>
				</div>
				<div className={'w-full max-w-xl p-2 px-4 mx-auto rounded-2xl bg-gray-600 text-center'}>
					<div className={'text-2xl text-center'}>Заказ:</div>
					{cart.length < 1 && <div>Выберите из каталога для заказа</div>}
					{cart.length >= 1 &&
						<div className='max-h-[70vh] overflow-auto'>
							{cart.map(cartItem =>
								<CartItem key={cartItem.id} cartItem={cartItem} handleUpdateQuantity={handleUpdateQuantity} removeFromCart={removeFromCart} />
							)}
							<div className='text-right'>Итого: {currencyFormat(cartTotal)}</div>
						</div>}
				</div>
				<div className='text-center'>
					<button className={productButton + ' m-4'} onClick={toggleForm} disabled={cart.length < 1}>Оформить заказ</button>
					<button className={productButton + ' m-4 hidden'} onClick={clearCart}>Очистить выбор</button>
				</div>
			</div>

			{/* Contact Form Modal */}
			{isFormOpen && (
				<div className="fixed z-40 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-gray-700 w-full max-w-lg p-6 rounded-lg shadow-lg text-center">
						<h2 className="text-xl font-semibold text-center mb-4">
							Отправка заказа
						</h2>
						<p className='text-sm'>Введите ваши контактные данные, мы свяжемся с вами в ближайщее время для уточнения стоимости доставки и пришлем ссылку для оплаты заказа</p>
						<form onSubmit={handleSubmit} className="space-y-2 text-gray-600">
							<input
								type="text"
								name="name"
								placeholder="Имя"
								value={formData.name}
								onChange={handleInputChange}
								className="w-full p-3 border border-gray-300 rounded-lg"
								required
							/>
							<input
								type="tel"
								name="phone"
								placeholder="Телефон"
								value={formData.phone}
								onChange={handleInputChange}
								className="w-full p-3 border border-gray-300 rounded-lg"
								required
							/>
							<input
								type="email"
								name="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full p-3 border border-gray-300 rounded-lg"
								required
							/>
							<textarea
								name="address"
								placeholder="Адрес доставки"
								value={formData.address}
								onChange={handleInputChange}
								className="w-full p-3 border border-gray-300 rounded-lg"
								rows={4}
								required
							></textarea>
							<div className="flex justify-between">
								<button
									type="button"
									onClick={toggleForm}
									className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400"
								>
									Отменить
								</button>
								<button
									type="submit"
									className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
								>
									Отправить
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
			{isHasMessage && (
				<div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-gray-700 w-full max-w-lg p-6 rounded-lg shadow-lg text-center relative">
						<div className='flex justify-end absolute top-1 right-1'>
							<button
								onClick={() => setIsHasMessage('')}
								className="bg-red-500 max-w-8 text-white p-1 rounded-lg hover:bg-red-600"
							>
								<CloseIcon />
							</button>
						</div>
						<h2 className="text-xl font-semibold text-center mb-4">
							Отправка заказа
						</h2>
						<div>{isHasMessage}</div>
					</div>
				</div>
			)
			}
		</>
	);
};

export default Shop;