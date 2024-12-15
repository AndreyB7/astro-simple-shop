import type { ProductsData } from '@/config/products.type';
import { productButton, productButtonSelected } from '@/styles/globalStyles';
import { currencyFormat } from '@/utils/utils';
import React, { useContext, useEffect, useState } from 'react';
import Cart from './Cart';
import { ShopContext } from './ShopContext';

const catDictionary: {
	[key: string]: string;
} = {
	all: 'Все товары',
	poliuretan: 'Полиуретан',
	color: 'Цветные',
	photochrome: 'Фотохром',
	optic: 'Для оптики',
	tone: 'Тонировка',
	liquid: 'Жидкости',
}

type Props = {
	products: ProductsData;
	productCategories: string[];
}

const filterButtonCss = 'px-4 py-2 rounded-md text-sm font-medium transition-all ease-in-out duration-200 bg-primary hover:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:bg-gray-700 sm:w-auto w-full text-center';

const Shop: React.FC<Props> = ({ products, productCategories }: Props) => {

	const context = useContext(ShopContext);

	if (!context) {
		return null; // or return a fallback UI if context is not available
	}

	const { cart, addToCart, removeFromCart } = context;

	const [searchParams, setSearchParams] = useState<URLSearchParams>();
	const [filteredProducts, setFilteredProducts] = useState(products);

	useEffect(() => {
		// Parse URLSearchParams on the client side only
		const params = new URLSearchParams(window.location.search);
		setSearchParams(params);
	  }, []);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const category = searchParams.get('category');
		let result = products;
		if (category) {
			result = result.filter((p) => p.cat.includes(category));
		}
		setFilteredProducts(result);
	}, [searchParams]);

	const handleFilterChange = (key: string, value: string) => {
		const newParams = new URLSearchParams(searchParams);
		if (value && value !== 'all') {
			newParams.set(key, value);
		} else {
			newParams.delete(key);
		}
		if (window.history.pushState) {
			const paramsString = newParams.toString() ? '?' + newParams.toString() : '';
			const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + paramsString;
			window.history.pushState({ path: newurl }, '', newurl);
		}
		setSearchParams(newParams);
	};

	const currentCategory = searchParams?.get('category') ?? 'all';

	return (
		<>
			<div className="flex justify-center flex-col items-center">
				<div className={'w-full max-w-xl p-2 px-4 rounded-2xl bg-gray-700 text-center my-4'}>
					Для уточнения подробностей мы всегда рады ответить на любые вопросы по телефону или в чате Телеграм
					{/* Оформление заказа с сайта находится в разработке, для оформления свяжитесь по телефону или напишите сообщение в Телеграм */}
					<div className={'grid justify-center p-2 m-1'}>
						<a className={'m-1 ' + productButton} href={'tel:+79955702014'} target='_blank'>+7 (995) 570-20-14</a>
						<a className={'m-1 ' + productButton} href={'https://telegram.me/aliasevpro'} target='_blank'>Сообщение Телеграм</a>
					</div>
				</div>
			</div>
			<div className="flex flex-wrap gap-4 justify-center items-center mb-4">
				{productCategories.map(pc => (
					<button
						key={pc}
						type="button"
						value={pc}
						onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleFilterChange('category', e.currentTarget.value)}
						className={filterButtonCss + `${pc.includes(currentCategory) ? ' bg-gray-800 ring-2' : ''}`}
					>
						{catDictionary[pc]}
					</button>
				))}
			</div>
			<div className='grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-y-5 md:gap-x-5 place-items-center'>
				{filteredProducts.map(p => {
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
			<Cart />
		</>
	);
};

export default Shop;