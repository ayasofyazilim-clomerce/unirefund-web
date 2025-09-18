import type {Locator, Page} from "@playwright/test";
import {expect} from "@playwright/test";

export async function fillStable(
  page: Page,
  locator: Locator,
  value: string,
  opts?: {hard?: boolean; attempts?: number; delay?: number},
) {
  const attempts = opts?.attempts ?? 3;
  const keyCombo = process.platform === "darwin" ? "Meta+A" : "Control+A";
  const typeDelay = opts?.delay ?? 40;

  await locator.waitFor({state: "visible", timeout: 15000});
  await expect(locator).toBeEditable({timeout: 15000});

  const tryOnce = async (): Promise<boolean> => {
    await locator.click({timeout: 5000});
    await page.waitForTimeout(80);
    await locator.press(keyCombo);
    await locator.press("Delete");
    await locator.type(value, {delay: typeDelay});
    const got = await locator.inputValue();
    if (got === value) return true;
    await page.waitForTimeout(150);
    return false;
  };

  const retry = async (left: number): Promise<void> => {
    const ok = await tryOnce();
    if (ok || left <= 1) return;
    return retry(left - 1);
  };

  await retry(attempts);

  if (opts?.hard) await expect(locator).toHaveValue(value);
  else await expect.soft(locator).toHaveValue(value);
}

export const byTestId = (page: Page) => (id: string) => page.getByTestId(id);
