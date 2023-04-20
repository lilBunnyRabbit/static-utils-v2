import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

const GH_REPO = "static-utils-v2";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === "serve" ? "/" : `/${GH_REPO}/`,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
