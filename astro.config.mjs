import react from '@astrojs/react';
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";

const SITE_HOST = 'aliasevpro.ru';
const SITE_URL = `https://${SITE_HOST}`;

// https://astro.build/config
export default defineConfig({
	site: import.meta.env.DEV
		? "http://localhost:4321"
		: SITE_URL,
	integrations: [
		tailwind(),
		sitemap({
			filter: (page) => page !== `${SITE_URL}/404_error/`,
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
					disallow: ['/404_error', '/private/*', '/*?*yclid=*'],
					crawlDelay: 10,
					sitemap: `${SITE_URL}/sitemap-index.xml`
				}
			],
			sitemap: true,
			host: SITE_HOST
		})
	],
	// SEO Optimization
	build: {
		inlineStylesheets: 'auto'
	},
	server: {
		host: true, // Allow connections from all network interfaces
		port: 4321
	},
	vite: {
		server: {
			watch: {
				usePolling: true
			},
			hmr: {
				protocol: 'ws'
			}
		}
	}
});
