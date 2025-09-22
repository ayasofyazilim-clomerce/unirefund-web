import type {Page} from "@playwright/test";

type AppReadyOptions = {
  spinnerTestId?: string;
  waitForNetworkIdle?: boolean;
  disableCaret?: boolean;
};

export async function appReady(page: Page, opts?: AppReadyOptions) {
  await page.waitForLoadState("domcontentloaded");
  if (opts?.waitForNetworkIdle) {
    await page.waitForLoadState("networkidle");
  }

  const spinnerId = opts?.spinnerTestId ?? "global-spinner";
  const s = page.getByTestId(spinnerId);

  const appeared = await s.waitFor({state: "visible", timeout: 500}).then(
    () => true,
    () => false,
  );

  if (appeared) {
    await s.waitFor({state: "hidden", timeout: 15_000});
  }

  await page.evaluate((disableCaret: boolean) => {
    type AppReadyWindow = Window & {__appReadyStyles?: boolean};
    const w = window as AppReadyWindow;
    if (w.__appReadyStyles) return;

    const style = document.createElement("style");
    style.setAttribute("data-app-ready-styles", "true");
    style.textContent = `
      *, *::before, *::after {
        transition: none !important;
        animation: none !important;
        ${disableCaret ? "caret-color: transparent !important;" : ""}
      }
    `;
    document.head.appendChild(style);
    w.__appReadyStyles = true;
  }, opts?.disableCaret ?? false);
}
