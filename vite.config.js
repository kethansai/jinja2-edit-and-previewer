import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "/jinja2-edit-and-previewer/",
  plugins: [vue()],
});
