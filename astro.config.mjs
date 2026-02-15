// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://HazaFG.github.io",
  base: "/proyecto-libros/",
  output: "static",

  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
