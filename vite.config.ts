import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const buildTime = new Date().getTime().toString();

function versionPlugin(): Plugin {
  return {
    name: 'version-generator',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ buildTime, version: '1.0.0' }, null, 2),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), versionPlugin()],
  base: './',
  define: {
    __APP_BUILD_TIME__: JSON.stringify(buildTime),
  },
  server: {
    port: 3000,
    open: true,
  },
});
