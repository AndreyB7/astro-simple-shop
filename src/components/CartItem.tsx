import type { Product } from '@/config/products.type';
import CloseIcon from '@/icons/commons/CloseIcon';
import { countProductTotal, currencyFormat } from '@/utils/utils';
import React from 'react';

type Props = {
	cartItem: Product,
	handleUpdateQuantity: (id: number, quantity: number) => void,
	removeFromCart: (id: number) => void,
}

const CartItem = ({ cartItem, handleUpdateQuantity, removeFromCart }: Props) => (
	<div className='flex flex-wrap text-center gap-2 border-b text-sm'>
		<div className='flex-1 text-left'>
			{cartItem.name}
			{cartItem.roll &&
				<div className='flex'>
					<div>{cartItem.roll ? `Ролик: ${cartItem.roll}мп` : ''}</div>
					<div className='ml-1'>{`${currencyFormat(cartItem.priceroll)}`}</div>
				</div>
			}
		</div>
		<div className='flex flex-col md:flex-row-reverse justify-center items-center my-1'>
			<button
				onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity && cartItem.quantity >= 1 ? cartItem.quantity + 1 : 1)}
				className="p-1 w-6 h-6 bg-gray-500 hover:bg-gray-300 rounded leading-none"
			>
				+
			</button>
			<div className="m-1 w-6 leading-none">
				<div>{cartItem.quantity}</div>
				{cartItem.type === 'film' ? <div>{'мп'}</div> : ''}
			</div>
			<button
				onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity && cartItem.quantity >= 2 ? cartItem.quantity - 1 : 1)}
				className="p-1 w-6 h-6 bg-gray-500 hover:bg-gray-300 rounded leading-none"
			>
				-
			</button>
		</div>
		<div className='flex-[.3] min-w-16 m-2'>{currencyFormat(countProductTotal(cartItem))}</div>
		<div className='flex'>
			<button
				onClick={() => removeFromCart(cartItem.id)}
				className="bg-red-500 max-w-8 text-white p-[.5] w-4 h-4 mt-2 rounded-lg hover:bg-red-600"
			>
				<CloseIcon />
			</button>
		</div>
	</div>
);

export default CartItem;
