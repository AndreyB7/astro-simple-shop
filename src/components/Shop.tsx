import type { ProductsData } from '@/config/products.type';
import { currencyFormat } from '@/utils/utils';
import React from 'react';

type Props = {
	products: ProductsData
}

const productButton = 'uppercase px-3 py-1 text-sm md:text-base bg-gradient-to-b from-primary to-secondary md:px-6 md:py-2 rounded-lg text-center font-semibold hover:scale-105 hover:opacity-85 transition inline-block';

const Shop = ({ products }: Props) => {

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-5 gap-x-5 place-items-center'>
			{products.map(p => {
				return (
					<div key={p.id} className='flex flex-wrap border rounded-2xl w-full h-full text-center'>
						<div className='w-full relative'>
							<img src='/films/film1.webp' alt={p.name}
								className="rounded-t-2xl object-cover" />
						</div>
						<div className='p-4 flex flex-col justify-self-stretch w-full'>
							<div className='text-lg'>{p.name}</div>
							{p.desc && <div className='text-primary'>{p.desc}</div>}
							<hr
								className="my-1 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
							<div>
								{p.priceroll && (<div><div>Цена за ролик:</div><div className='font-bold'>{currencyFormat(p.priceroll)}</div></div>)}
								{p.pricecut && (<div><div>Цена 1мп:</div><div className='font-bold'>{currencyFormat(p.pricecut)}</div></div>)}
								{p.price && (<div><div>Цена:</div><div className='font-bold'>{currencyFormat(p.price)}</div></div>)}
							</div>
							<div className='mt-2 flex flex-col h-full justify-end'>
								<button className={productButton}>Выбрать</button>
							</div>
						</div>
					</div>
				)
			}
			)}
		</div>
	);
};

export default Shop;