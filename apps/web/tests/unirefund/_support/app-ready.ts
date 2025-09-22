import type {Page} from "@playwright/test";

// Call after each page.goto navigation
export async function appReady(page: Page, opts?: {spinnerTestId?: string}) {
  // 1) Wait for page to load and become idle
  await page.waitForLoadState("domcontentloaded");
  // For SPAs, networkidle is usually not required, but good for initial render
  await page.waitForLoadState("networkidle");

  // 2) Wait for global spinner to disappear if present
  const spinner = opts?.spinnerTestId ?? "global-spinner";
  const s = page.getByTestId(spinner);
  if (await s.isVisible()) {
    await s.waitFor({state: "hidden", timeout: 15000});
  }

  // 3) Disable all animations and transitions for this test session
  await page.addStyleTag({
    content: `
      *, *::before, *::after { 
        transition: none !important; 
        animation: none !important; 
        caret-color: transparent !important;
      }
    `,
  });
}
