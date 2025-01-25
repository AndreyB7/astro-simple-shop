import { urls } from "@/config/constants";
import type { ProductTypesData } from "@/config/landing.interface";

export const productTypesData: ProductTypesData = {
	title: "Каталог и цены",
	tiers: [
		{
			img: "products/TPU_Gloss_Clear_190_Mic.webp",
			title: "Полиуретан",
			description: "TPU - американский полиуретан Lubrizol, клей Agutek пр-во Америка. Удобен для оклейки.",
			features: [
				"Толщина 180,200,210,225 микрон",
				"Высокая первичная прилипаемость",
				"Хорошо тянется, можно поднимать без появления шоклайнов",
				"Soft, middle, hard top coat",
				"Плёнка не желтеет, не отклеивается"
			],
			links: [{
				url: urls.pages.poliuretan,
				label: "Подробнее о полиуретане"
			}]
		},
		{
			img: "products/PET_2020_Bicolor_Tiffany.webp",
			title: "Гибрид",
			description: "TPH - гибридный полиуретан с эффектом само-заживления, PET - гибридный винил.",
			features: [
				"Нанесение сухим и мокрым методом",
				"Гидрофобный эффект",
				"Эффект самовосстановления царапин",
				"Плёнка не желтеет, не отклеивается",
				"Широкая цветовая палитра"
			],
			links: [{
				url: urls.pages.vinil,
				label: "Подробнее о виниле"
			}]
		},
		{
			img: "products/TPU_Photochrome_Black_190_Mic.webp",
			title: "Фотохром",
			description: "Photochromic TPU - толщина 200 микрон, долгий срок службы, удобное нанесение",
			features: [
				"Высокая чувствительность к изменению освещения",
				"Легкий монтаж мокрым методом",
				"Удобна в работе, можно поднимать",
				"Эффект самовосстановления царапин",
				"Срок службы 5 лет"
			],
			links: [{
				url: urls.pages.photochrome,
				label: "Подробнее о фотохроме"
			}]
		},
		{
			img: "products/Black_tint_film_35.webp",
			title: "Тонировка",
			description: "Керамическая тонированная плёнка!",
			features: [
				"Классическая черная. Aтермальная.",
				"Практически полная блокировка UV-излучения",
				"Идеальная прозрачность и отсутствие бликов",
				"Разная светопропускаемость",
				"Увеличенный срок службы"
			],
			links: [{
				url: urls.pages.tinting,
				label: "Подробнее о тонировке"
			}]
		},
		{
			img: "products/tools.webp",
			title: "Инструмент",
			description: "СКОРО В ПРОДАЖЕ!",
			features: [
				"Личный выбор профессионала!",
				"Удобство и долговечность",
				"Оптимальное использование расходников",
				"Только необходимое в работе",
				"Проверенные временем решения"
			],
			links: []
		},
		{
			img: "products/film-on-liquid.webp",
			title: "Жидкости",
			description: "Жидкие средства для установки защитных пленок.",
			features: [
				"Жидкости проверенны лично",
				"Только то, что действительно необходимо",
				"Оптимальный расход",
				"Безопасные для вас"
			],
			links: [{
				url: urls.pages.liquid,
				label: "Подробнее о жидкостях"
			}]
		}
	]
};