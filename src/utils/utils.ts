export function currencyFormat(num: number): string {
	return num.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }