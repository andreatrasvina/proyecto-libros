// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import mdx from '@astrojs/mdx';
import react from '@astrojs/react'; // 🧩 ← integración React

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    react(), // ⚛️ ← aquí activamos React dentro de Astro
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

