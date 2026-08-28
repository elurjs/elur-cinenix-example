import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist/_elur",
    emptyOutDir: false,
    rollupOptions: {
      input: ".elur/entry-client.ts",
      output: {
        entryFileNames: "entry-client.js",
      },
    },
  },
});
