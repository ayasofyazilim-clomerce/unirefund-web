import type {Locator, Page} from "@playwright/test";
import {expect} from "@playwright/test";

export const digitsOnly = (s: string) => (s || "").replace(/\D/g, "");

export async function fillPhoneTR(page: Page, locator: Locator, rawDigits: string) {
  const expectedDigits = `90${digitsOnly(rawDigits)}`;

  await locator.waitFor({state: "visible", timeout: 15000});
  await expect(locator).toBeEditable({timeout: 15000});
  await locator.scrollIntoViewIfNeeded();

  await locator.click();
  await locator.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await locator.press("Delete");

  await locator.type("+90");
  await expect.poll(async () => (await locator.inputValue()).startsWith("+90")).toBeTruthy();

  await locator.type(digitsOnly(rawDigits));
  const got = digitsOnly(await locator.inputValue());
  expect.soft(got).toBe(expectedDigits);
}
