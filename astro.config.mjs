// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://berikatours.ge',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // hreflang alternates for every page in the sitemap
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ru: 'ru', ka: 'ka', ar: 'ar', he: 'he' },
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
