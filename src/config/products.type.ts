export type ProductsData = Product[];

export type Product = {
	id: number,
	type: string,
	art: string,
	cat: string,
	name: string,
	slug: string,
	desc: string,
	img: string,
	price: number,
	roll?: number,
	storage: number,
	priceroll?: number,
	quantity?: number,
}
