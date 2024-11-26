import type { ProductsData } from '@/config/products.type';
import { currencyFormat } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import type { Product } from "@/config/products.type";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorageUtils.ts";

type Props = {
  products: ProductsData
}

const productButton = 'uppercase px-3 py-1 text-sm md:text-base bg-gradient-to-b from-primary to-secondary md:px-6 md:py-2 rounded-lg text-center font-semibold hover:opacity-85 transition inline-block';
const productButtonSelected = 'uppercase px-3 py-1 text-sm md:text-base bg-gradient-to-b from-green-800 to-green-700 md:px-6 md:py-2 rounded-lg text-center font-semibold hover:opacity-85 transition inline-block';

const Shop = ({ products }: Props) => {
  const [cart, setCart] = useState<Product[]>(() => []);

  useEffect(() => {
    const storedCart = getFromLocalStorage("cart");
    if (storedCart) {
      setCart(storedCart);
    }
  }, []);
  // Save to local storage whenever cart changes
  useEffect(() => {
    saveToLocalStorage("cart", cart);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart: Product[]) => [...prevCart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart: Product[]) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <>
      <div className="flex justify-center flex-col items-center">
        <div className={ 'w-full max-w-xl p-2 px-4 rounded-2xl bg-gray-700 text-center' }>
          <div className={ 'text-2xl text-center' }>Заказ:</div>
          { cart.length < 1 && <div>Выберите из каталога для заказа</div> }
          { cart.map(cartItem => {
            return (<div>{ cartItem.name }</div>)
          }) }
        </div>
        <div className={ 'w-full max-w-xl p-2 px-4 rounded-2xl bg-gray-700 text-center mt-4' }>
          Оформление заказа с сайта находится в разработке, для оформления свяжитесь по телефону:
          <a className={'block'} href={'tel:+79955702014'}>+7 (995) 570-20-14</a>
        </div>
        <button className={ productButton + ' m-4' } onClick={ clearCart }>Очистить выбор</button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-5 gap-x-5 place-items-center'>
        { products.map(p => {
            const isInCart = cart.some(cp => p.id === cp.id);
            return (
              <div key={ p.id } className='flex flex-col border border-gray-700 rounded-2xl w-full h-full text-center'>
                <div className='w-full relative flex pb-[61%] h-0'>
                  <img src='/films/film1.webp' alt={ p.name }
                       className="rounded-t-2xl object-cover w-full h-full absolute"/>
                </div>
                <div className='p-4 flex flex-col flex-grow justify-self-stretch w-full'>
                  <div className='text-xl font-bold'>{ p.name }</div>
                  { p.desc && <div className='text-base opacity-50'>{ p.desc }</div> }
                  <div>
                    <hr/>
                  </div>
                  <div className='mt-2 flex flex-col h-full justify-end'>
                    <div className='mb-2'>
                      { p.priceroll && (<div>
                        <div>Цена за ролик { p.roll + 'мп' }:</div>
                        <div className='text-xl font-bold'>{ currencyFormat(p.priceroll) }</div>
                      </div>) }
                      { p.price && (<div>
                        <div>Цена:</div>
                        <div className='text-xl font-bold'>{ currencyFormat(p.price) }</div>
                      </div>) }
                    </div>
                    { isInCart ?
                      <button onClick={ () => removeFromCart(p.id) }
                              className={ productButtonSelected }>
                        { 'Выбран' }
                      </button> :
                      <button onClick={ () => addToCart(p) }
                              className={ productButton }>
                        { 'Выбрать' }
                      </button>
                    }
                  </div>
                </div>
              </div>
            )
          }
        ) }
      </div>
    </>
  );
};

export default Shop;