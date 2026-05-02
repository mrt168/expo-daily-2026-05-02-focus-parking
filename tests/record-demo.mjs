import { chromium } from "/Users/mrt168/Documents/working/convini_project/ai-interview-system/node_modules/playwright/index.mjs";
import fs from "fs/promises";
import path from "path";

const BASE_URL = "http://localhost:8099";
const OUT_DIR = "tests/video-tmp";

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: { dir: OUT_DIR, size: { width: 390, height: 844 } },
  });
  const page = await ctx.newPage();

  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2500);

  // Onboarding
  for (let i = 0; i < 2; i++) {
    const next = page.getByText("次へ").first();
    if (await next.isVisible({ timeout: 2000 }).catch(() => false)) {
      await next.click();
      await page.waitForTimeout(1200);
    }
  }
  const start = page.getByText("はじめる").first();
  if (await start.isVisible({ timeout: 2000 }).catch(() => false)) {
    await start.click();
    await page.waitForTimeout(2000);
  }

  // Park a concern (tap red color)
  const redBtn = page.locator('[data-testid="park-red"]').first();
  if (await redBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await redBtn.click();
    await page.waitForTimeout(2000);
    // navigate back via URL
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
  }

  // List tab
  const list = page.getByText("一覧").first();
  if (await list.isVisible({ timeout: 2000 }).catch(() => false)) {
    await list.click();
    await page.waitForTimeout(2500);
  }

  // Triage tab
  const triage = page.getByText("仕分け").first();
  if (await triage.isVisible({ timeout: 2000 }).catch(() => false)) {
    await triage.click();
    await page.waitForTimeout(2500);
    const released = page.getByText("手放す").first();
    if (await released.isVisible({ timeout: 2000 }).catch(() => false)) {
      await released.click();
      await page.waitForTimeout(1800);
    }
  }

  // Report tab
  const report = page.getByText("レポート").first();
  if (await report.isVisible({ timeout: 2000 }).catch(() => false)) {
    await report.click();
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1800);
  }

  // Settings tab
  const settings = page.getByText("設定").first();
  if (await settings.isVisible({ timeout: 2000 }).catch(() => false)) {
    await settings.click();
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1500);
  }

  await ctx.close();
  await browser.close();

  // find webm file
  const files = await fs.readdir(OUT_DIR);
  const webm = files.find((f) => f.endsWith(".webm"));
  if (webm) {
    console.log("Recorded:", path.join(OUT_DIR, webm));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
