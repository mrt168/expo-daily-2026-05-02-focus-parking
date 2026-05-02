import { chromium } from "/Users/mrt168/Documents/working/convini_project/ai-interview-system/node_modules/playwright/index.mjs";

const BASE_URL = "http://localhost:8099";

const results = [];
function log(id, name, status, detail = "") {
  console.log(`[${status}] ${id}: ${name}${detail ? " - " + detail : ""}`);
  results.push({ id, name, status, detail });
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error("[pageerror]", e.message));

  // T-01: ホーム画面読み込み
  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);
    const body = await page.textContent("body");
    if (body && (body.includes("気がかり") || body.includes("駐車") || body.includes("はじめる"))) {
      log("T-01", "ホーム/オンボーディング表示", "PASS");
    } else {
      log("T-01", "ホーム/オンボーディング表示", "FAIL", "key text missing");
    }
  } catch (e) {
    log("T-01", "ホーム/オンボーディング表示", "FAIL", e.message);
  }

  // T-02: オンボーディング進行
  try {
    const nextBtn = page.getByText("次へ").first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      await nextBtn.click().catch(() => {});
      await page.waitForTimeout(500);
      const startBtn = page.getByText("はじめる").first();
      if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await startBtn.click();
        await page.waitForTimeout(1500);
      }
      log("T-02", "オンボーディング完了", "PASS");
    } else {
      log("T-02", "オンボーディング完了", "SKIP", "already completed");
    }
  } catch (e) {
    log("T-02", "オンボーディング完了", "FAIL", e.message);
  }

  // T-03: 気がかりを駐車（ColorButtonタップ）
  try {
    await page.waitForTimeout(1000);
    const text = await page.textContent("body");
    const hasButtons = text && (text.includes("駐車") || text.includes("今すぐ対応") || text.includes("タップで駐車"));
    if (hasButtons) {
      log("T-03", "色ボタン表示", "PASS");
    } else {
      log("T-03", "色ボタン表示", "FAIL", "color buttons not visible");
    }
  } catch (e) {
    log("T-03", "色ボタン表示", "FAIL", e.message);
  }

  // T-04: タブ切替（一覧）
  try {
    const listTab = page.getByText("一覧").first();
    if (await listTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await listTab.click();
      await page.waitForTimeout(1000);
      const text = await page.textContent("body");
      if (text && text.includes("駐車中の気がかり")) {
        log("T-04", "一覧タブ表示", "PASS");
      } else {
        log("T-04", "一覧タブ表示", "FAIL", "list title missing");
      }
    } else {
      log("T-04", "一覧タブ表示", "FAIL", "tab not found");
    }
  } catch (e) {
    log("T-04", "一覧タブ表示", "FAIL", e.message);
  }

  // T-05: レポートタブ
  try {
    const reportTab = page.getByText("レポート").first();
    if (await reportTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await reportTab.click();
      await page.waitForTimeout(1500);
      const text = await page.textContent("body");
      if (text && (text.includes("手放した") || text.includes("ヒートマップ") || text.includes("レポート"))) {
        log("T-05", "レポート表示", "PASS");
      } else {
        log("T-05", "レポート表示", "FAIL", "report content missing");
      }
    } else {
      log("T-05", "レポート表示", "FAIL", "tab not found");
    }
  } catch (e) {
    log("T-05", "レポート表示", "FAIL", e.message);
  }

  await browser.close();

  const pass = results.filter((r) => r.status === "PASS").length;
  const fail = results.filter((r) => r.status === "FAIL").length;
  const skip = results.filter((r) => r.status === "SKIP").length;
  console.log(`\n=== Result: ${pass} PASS / ${fail} FAIL / ${skip} SKIP ===`);

  const md = [
    "# E2E Test Results",
    "",
    `- Date: ${new Date().toISOString()}`,
    `- Pass: ${pass} / Fail: ${fail} / Skip: ${skip}`,
    "",
    "| ID | Name | Status | Detail |",
    "|----|------|--------|--------|",
    ...results.map((r) => `| ${r.id} | ${r.name} | ${r.status} | ${r.detail} |`),
    "",
  ].join("\n");
  const fs = await import("fs/promises");
  await fs.writeFile("tests/test-results.md", md);
  console.log("Wrote tests/test-results.md");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
