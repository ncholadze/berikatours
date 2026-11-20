// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://berikatours.ge',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // photos uploaded in the admin panel (Supabase Storage) are optimized at build time
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      // a custom Supabase address set via environment variable (also used by tests)
      ...(process.env.PUBLIC_SUPABASE_URL ? [{ hostname: new URL(process.env.PUBLIC_SUPABASE_URL).hostname }] : []),
    ],
  },
  integrations: [
    sitemap({
      // hreflang alternates for every page in the sitemap
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ru: 'ru', ka: 'ka', ar: 'ar', he: 'he' },
      },
      filter: (page) => !page.includes('/404') && !page.includes('/admin'),
    }),
  ],
});
