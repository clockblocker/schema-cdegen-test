/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { createRequire } from "node:module";
import { withWyw } from "@wyw-in-js/nextjs";

// @wyw-in-js/nextjs currently calls require(...) internally, so provide it in ESM config.
globalThis.require = createRequire(import.meta.url);

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,

	/**
	 * If you are using `appDir` then you must comment the below `i18n` config out.
	 *
	 * @see https://github.com/vercel/next.js/issues/41980
	 */
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
};

export default withWyw(config);
