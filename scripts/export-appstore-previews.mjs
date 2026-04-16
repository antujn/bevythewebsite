import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import process from "node:process";
import path from "node:path";

import { chromium } from "playwright";

const SIZES = [
  { label: "iphone-6.9", width: 1320, height: 2868 },
  { label: "iphone-6.5", width: 1290, height: 2796 },
];

const BASE_EXPORT_WIDTH = Number(process.env.APPSTORE_BASE_WIDTH ?? 280);
const BASE_EXPORT_HEIGHT = Number(process.env.APPSTORE_BASE_HEIGHT ?? 606);

const DEFAULT_SLIDE_COUNT = 10;
const OUTPUT_ROOT = path.resolve(process.cwd(), "appstore-previews");

const BASE_URL = process.env.APPSTORE_EXPORT_BASE_URL;
const PORT = process.env.APPSTORE_EXPORT_PORT ?? "3200";
const SLIDE_COUNT = Number(process.env.APPSTORE_SLIDE_COUNT ?? DEFAULT_SLIDE_COUNT);

const localUrl = `http://127.0.0.1:${PORT}`;
const targetUrl = BASE_URL ?? localUrl;

function startServer() {
  const child = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["run", "dev", "--", "--port", PORT],
    {
      stdio: "pipe",
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  );

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[dev] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[dev] ${chunk}`);
  });

  return child;
}

async function waitForServerOrExit(url, child, timeoutMs = 120000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (child.exitCode !== null) {
      throw new Error(
        "Local dev server exited before startup. Set APPSTORE_EXPORT_BASE_URL to an already-running site URL.",
      );
    }

    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.ok || (response.status >= 300 && response.status < 400)) {
        return;
      }
    } catch {
      // Keep polling until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function captureSizeSet(browser, size) {
  const outputDir = path.join(OUTPUT_ROOT, size.label, `${size.width}x${size.height}`);
  await mkdir(outputDir, { recursive: true });

  const context = await browser.newContext({
    viewport: {
      width: Math.max(size.width + 800, 2200),
      height: Math.max(size.height + 500, 3400),
    },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  for (let index = 0; index < SLIDE_COUNT; index += 1) {
    const slideUrl = `${targetUrl}/appstore-previews?slide=${index + 1}`;
    await page.goto(slideUrl, { waitUntil: "networkidle" });

    const exportScale = Math.max(
      size.width / BASE_EXPORT_WIDTH,
      size.height / BASE_EXPORT_HEIGHT,
    );

    const scaledWidth = BASE_EXPORT_WIDTH * exportScale;
    const scaledHeight = BASE_EXPORT_HEIGHT * exportScale;
    const clipX = Math.max(0, (scaledWidth - size.width) / 2);
    const clipY = Math.max(0, (scaledHeight - size.height) / 2);

    await page.evaluate(({ baseWidth, baseHeight, scale }) => {
      const story = document.querySelector(".preview-story");
      if (!story) return;

      document.documentElement.style.margin = "0";
      document.body.style.margin = "0";
      document.body.style.background = "#000";
      document.body.style.overflow = "hidden";

      Object.assign(story.style, {
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        maxWidth: "none",
        aspectRatio: "auto",
        borderRadius: "0",
        position: "fixed",
        inset: "0 auto auto 0",
        transformOrigin: "top left",
        transform: `scale(${scale})`,
      });
    }, {
      baseWidth: BASE_EXPORT_WIDTH,
      baseHeight: BASE_EXPORT_HEIGHT,
      scale: exportScale,
    });

    const outputPath = path.join(outputDir, `${String(index + 1).padStart(2, "0")}.png`);
    await page.screenshot({
      path: outputPath,
      clip: { x: clipX, y: clipY, width: size.width, height: size.height },
    });
    process.stdout.write(`Saved ${outputPath}\n`);
  }

  await context.close();
}

let devServer;

try {
  if (!BASE_URL) {
    devServer = startServer();
    await waitForServerOrExit(localUrl, devServer);
  }

  const browser = await chromium.launch();

  for (const size of SIZES) {
    await captureSizeSet(browser, size);
  }

  await browser.close();
  process.stdout.write("App Store preview export complete.\n");
} catch (error) {
  process.stderr.write(`Export failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
} finally {
  if (devServer && !devServer.killed) {
    devServer.kill("SIGTERM");
  }
}
