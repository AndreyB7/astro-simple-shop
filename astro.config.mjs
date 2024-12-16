import react from '@astrojs/react';
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
	site: import.meta.env.DEV
		? "http://localhost:4321"
		: "https://aliasevpro.ru",
	integrations: [
		tailwind(),
		sitemap({
			filter: (page) => page !== 'https://aliasevpro.ru/404_error/',
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		}),
		react(),
		robotsTxt({
			policy: [
				{
					userAgent: '*',
					allow: '/',
					disallow: ['/404_error', '/private/*'],
					crawlDelay: 10,
					sitemap: 'https://aliasevpro.ru/sitemap-index.xml'
				}
			],
			sitemap: true,
			host: 'https://aliasevpro.ru'
		})
	],
	// SEO Optimization
	build: {
		inlineStylesheets: 'auto'
	},
});
