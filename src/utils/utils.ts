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

export const getProductSlug = (product: Product): string => {
	const transliterationMap: { [key: string]: string } = {
		'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
		'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
		'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
		'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
		'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
		'э': 'e', 'ю': 'yu', 'я': 'ya'
	};

	const transliteratedName = product.name
		.toLowerCase()
		.replace(/[а-яё]/g, (char) => transliterationMap[char] || char)
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9\-]/g, '');

	return encodeURIComponent(transliteratedName);
}