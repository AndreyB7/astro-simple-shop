import react from '@astrojs/react';
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.DEV
    ? "http://localhost:4321"
    : "https://aliasevpro.ru/",
  integrations: [tailwind(), sitemap(), react(),
    robotsTxt({
        policy: [
          {
            userAgent: '*',
            allow: '/',
            // disallow: '/',
            crawlDelay: 10,
          }
        ],
      })
  ],
});
