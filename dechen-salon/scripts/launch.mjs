import { chromium } from "playwright";
import { existsSync, readdirSync } from "node:fs";

/**
 * Launches the Chromium that is already on this machine.
 *
 * Playwright pins an exact browser build per release, and the one installed
 * here may not match, so we resolve the executable ourselves instead of asking
 * Playwright to download one.
 *
 * The GL flags matter: headless Chromium has no GPU, and without SwiftShader
 * every WebGL context creation fails — which would make the strand silently
 * fall back to its poster in every screenshot and tell us nothing.
 */
export function findChromium() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!existsSync(root)) return undefined;

  const candidates = readdirSync(root)
    .filter((name) => name.startsWith("chromium-"))
    .map((name) => `${root}/${name}/chrome-linux/chrome`)
    .filter((path) => existsSync(path));

  return candidates[0];
}

export async function launch() {
  return chromium.launch({
    executablePath: findChromium(),
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--no-sandbox",
    ],
  });
}
