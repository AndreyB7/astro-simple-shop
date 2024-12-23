export type ProductsData = Product[];

export type Product = {
	id: number,
	type: string,
	art: number,
	cat: string,
	name: string,
	desc: string,
	img: string,
	price: number,
	roll?: number,
	priceroll?: number,
	quantity?: number,
}
