import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  // production build 出力先はデフォルト dist。server 用バンドルは別出力します（下で --ssr 指定）
});
