export type ProductsData = Product[];

export type Product = {
	id: number,
	name: string,
	desc?: string,
	priceroll?: number,
	pricecut?: number,
	price?: number,
}