import CartIcon from "@/icons/commons/CartIcon";
import CloseIcon from "@/icons/commons/CloseIcon";
import { productButton } from "@/styles/globalStyles";
import { countProductTotal, currencyFormat } from "@/utils/utils";
import React, { useContext, useState } from "react";
import CartItem from "./CartItem";
import { ShopContext, type ContactFormData } from "./ShopContext";

const Cart = () => {
	const context = useContext(ShopContext);

	if (!context) {
		return null;
	}

	const { cart, formData, clearCart, removeFromCart, handleInputChange, handleUpdateQuantity } = context;

	const [cartOpen, setCartOpen] = useState<boolean>(false);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isHasMessage, setIsHasMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false);

	const toggleCart = () => setCartOpen((prev) => !prev);
	const toggleForm = () => setIsFormOpen((prev) => !prev);

	const cartTotal = cart.reduce((sum: number, cartItem) => {
		return sum + countProductTotal(cartItem);
	}, 0);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const data: {
			cart: {
				name: string,
				quantity?: number,
				productTotal: number,
			}[];
			total: number;
			formData: ContactFormData;
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
				setIsFormOpen(false);
			} else {
				setIsHasMessage("Ошибка обработки заказа, пожалуста свяжитесь с нами по телефону");
				console.log("Error submitting the form:", responseData.message);
			}
		} catch (error) {
			console.error("Error submitting the form:", error);
			setIsHasMessage("Ошибка отправки заказа, пожалуста проверте подключение к интернету или свяжитесь с нами по телефону");
		} finally {
			setIsSubmitting(false); // Re-enable button
		}
	};

	return (
		<>
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
								placeholder="Почтовый адрес доставки"
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
									disabled={isSubmitting}
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
	)
}

export default Cart;