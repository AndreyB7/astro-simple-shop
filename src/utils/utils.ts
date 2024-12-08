import type { Product } from "@/config/products.type";

export function currencyFormat(num: number | undefined): string {
	if (!num) return '';
	return num.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' ₽'
}

export function countProductTotal(product: Product) {
	if (!product.quantity) {
		return 0
	}
	if (product.roll && product.priceroll) {
		const packsCount = Math.floor(product.quantity / product.roll);
		const metersCount = product.quantity % product.roll;
		return packsCount * product.priceroll + metersCount * product.price;
	}
	return product.quantity * product.price;
}