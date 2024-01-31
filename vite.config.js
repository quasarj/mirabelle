// FILE: vite.config.js

import { defineConfig } from "vite";

export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin", 
      "Cross-Origin-Embedder-Policy": "require-corp", 
    },
    proxy: {
      '/papi': 'http://tcia-posda-rh-1.ad.uams.edu',
    },
  },
});

