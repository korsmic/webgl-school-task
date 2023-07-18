import { defineConfig } from 'astro/config';
import config from './.config';
import relativeLinks from 'astro-relative-links';
import glsl from 'vite-plugin-glsl';

// https://astro.build/config
// https://purgecss.com/configuration.html#options

const IS_WP = process.env.IS_WP === 'true';

export default defineConfig({
  integrations: [relativeLinks()],
  env: {
    IS_WP: IS_WP,
  },
  site: `${config.SITE_URL}${IS_WP ? config.WP_PATH : config.SITE_PATH}`,
  base: `${IS_WP ? config.WP_PATH : config.SITE_PATH}`,
  output: 'static',
  outDir: `./dist/${IS_WP ? config.WP_PATH : config.SITE_PATH}`,
  build: {
    format: 'directory',
    assets: 'assets',
  },
  vite: {
    plugins: [glsl()],
    build: {
      cssCodeSplit: false,
      // rollupOptions: {
      //   output: {
      //     manualChunks: () => `assets/js/[name].js`,
      //     entryFileNames: `assets/js/[name].js`,
      //     assetFileNames: `assets/css/[name][extname]`,
      //     chunkFileNames: `assets/js/[name].js`,
      //   },
      // },
    },
  },
});
