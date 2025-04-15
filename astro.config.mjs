// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://raipost.com',
	integrations: [mdx(), sitemap()],
	output: 'static',
	// Настройки кэширования
	vite: {
		build: {
			assetsInlineLimit: 4096, // Файлы меньше 4KB будут инлайниться
		},
	},
	// Настройки для изображений
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp',
		},
		// Настройки кэширования для изображений
		cacheDir: './.cache/image',
		// Поддерживаемые форматы
		supportedFormats: ['png', 'jpg', 'jpeg', 'webp', 'avif'],
	},
});
