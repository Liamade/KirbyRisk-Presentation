import { defineConfig } from 'vite';

// Relative base so the built deck works from any URL — file://, localhost,
// and GitHub Pages' project subpath (…github.io/KirbyRisk-Presentation/).
export default defineConfig({
  base: './',
});
