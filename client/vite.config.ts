// import { sentryVitePlugin } from '@sentry/vite-plugin';
import type { PluginOption } from 'vite';
// import { defineConfig, loadEnv } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from "path"

// https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
export default defineConfig(() => {
  // const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react() as PluginOption[],
      // sentryVitePlugin({
      //   org: 'todo:replace',
      //   project: 'todo:replace',
      //   authToken: env.SENTRY_AUTH_TOKEN,
      // }),
    ],
    define: {
      'import.meta.env.GIT_BRANCH': JSON.stringify(process.env.GITHUB_REF_NAME),
      'import.meta.env.GIT_SHA': JSON.stringify(process.env.GITHUB_SHA),
      'import.meta.env.E2E': JSON.stringify(process.env.E2E),
    },
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
