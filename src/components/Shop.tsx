import type { ProductsData } from '@/config/products.type';
import { productButton, productButtonSelected } from '@/styles/globalStyles';
import { currencyFormat, getProductSlug } from '@/utils/utils';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Cart from './Cart';
import { ShopContext } from './ShopContext';

export const catDictionary: {
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

const scrollToWithOffset = (id: string) => {
	const element = document.getElementById(id);
	const offset = 160; // Fixed header height
	if (element) {
		const elementPosition =
			element.getBoundingClientRect().top;
		const offsetPosition =
			elementPosition + window.scrollY - offset;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth",
		});
	}
};

const scrollToHash = () => {
	const hash = window.location.hash;
	if (!hash) {
		return;
	}
	const targetId = hash.substring(1);
	scrollToWithOffset(targetId);
};

const filterButtonCss = 'px-4 py-2 rounded-md text-sm font-medium transition-all ease-in-out duration-200 hover:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:bg-gray-700 sm:w-auto w-full text-center';

const Shop: React.FC<Props> = ({ products, productCategories }: Props) => {

	const context = useContext(ShopContext);

	if (!context) {
		return null;
	}

	const { cart, addToCart, removeFromCart } = context;

	const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
	const [currentCategory, setCurrentCategory] = useState<string>('all');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const paramsOnLoad = new URLSearchParams(window.location.search);
			setSearchParams(paramsOnLoad);
			setCurrentCategory(paramsOnLoad.get('category') ?? 'all');
		}
	}, []);

	useEffect(() => {
		scrollToHash(); // scroll to product if we follow from single product page
	}, [currentCategory]);

	const filteredProducts = useMemo(() => {
		if (currentCategory === 'all') return products;
		return products.filter((p) => p.cat.includes(currentCategory));
	}, [products, currentCategory]);

	const handleFilterChange = useCallback((key: string, value: string) => {
		const newParams = new URLSearchParams(searchParams?.toString() ?? '');
		if (value && value !== 'all') {
			newParams.set(key, value);
		} else {
			newParams.delete(key);
		}

		const paramsString = newParams.toString() ? '?' + newParams.toString() : '';
		const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${paramsString}`;
		window.history.pushState({ path: newurl }, '', newurl);

		setSearchParams(newParams);
		setCurrentCategory(value);
	}, [searchParams]);

	const FilterButtons = useMemo(() => (
		<div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 justify-center items-center mb-4">
			{productCategories.map(pc => (
				<button
					key={pc}
					type="button"
					value={pc}
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleFilterChange('category', e.currentTarget.value)}
					className={filterButtonCss + `${pc === currentCategory ? ' bg-gray-800 ring-2' : ' bg-primary'}`}
				>
					{catDictionary[pc]}
				</button>
			))}
		</div>
	), [productCategories, currentCategory, handleFilterChange]);

	return (
		<>
			<div className="flex justify-center flex-col items-center">
				<div className={'w-full max-w-xl p-2 px-4 rounded-2xl bg-gray-700 text-center my-4'}>
					Для уточнения подробностей мы всегда рады ответить на любые вопросы по телефону или в чате Телеграм
					{/* Оформление заказа с сайта находится в разработке, для оформления свяжитесь по телефону или напишите сообщение в Телеграм */}
					<div className={'grid justify-center p-2 m-1'}>
						<a className={'m-1 ' + productButton} href={'tel:+79955702014'} target='_blank' rel="noopener noreferrer">+7 (995) 570-20-14</a>
						<a className={'m-1 ' + productButton} href={'https://telegram.me/aliasevpro'} target='_blank' rel="noopener noreferrer">Сообщение Телеграм</a>
					</div>
				</div>
			</div>
			{FilterButtons}
			<div className='grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-y-5 md:gap-x-5 place-items-center'>
				{filteredProducts.map(p => {
					const slug = getProductSlug(p);
					const isInCart = cart.some(cp => p.id === cp.id);
					return (
						<div key={p.id} id={slug} className='flex flex-col border border-gray-700 rounded-2xl w-full h-full text-center'>
							<div className='w-full relative flex pb-[61%] h-0'>
								<img src={`/products/${p.img}`} alt={p.name}
									className="rounded-t-2xl object-cover w-full h-full absolute" />
							</div>
							<div className='p-2 md:p-4 flex flex-col flex-grow justify-self-stretch w-full'>
								<a href={`/products/${slug}`}
									title={p.name}>
									<div className='text-lg font-semibold'>{p.name}</div>
								</a>
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
									{isInCart ? (
										<button
											onClick={() => removeFromCart(p.id)}
											className={productButtonSelected}
											suppressHydrationWarning
										>
											{typeof window === 'undefined' ? 'Выбрать' : 'Выбран'}
										</button>
									) : (
										<button
											onClick={() => addToCart(p)}
											className={productButton}
											suppressHydrationWarning
										>
											{'Выбрать'}
										</button>
									)}
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