// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL final do blog. Usada em canonical, Open Graph, sitemap e RSS.
export default defineConfig({
  site: 'https://blog.gerlujoias.com.br',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
