import type {Locator, Page} from "@playwright/test";

/**
 * Waits for a locator to become visible and clicks it with retries.
 * Keeps the same behavior as the original individual test's safeClick.
 */
/* eslint-disable no-await-in-loop -- Sequential retries require awaiting inside the loop to avoid race conditions and flakiness */
export async function safeClick(locator: Locator, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await locator.waitFor({state: "visible", timeout: 5000});
      await locator.scrollIntoViewIfNeeded();
      await locator.page().waitForTimeout(30);
      await locator.click({timeout: 3000});
      return;
    } catch {
      await locator.page().waitForTimeout(200);
    }
  }
  throw new Error("Click failed after retries");
}
/* eslint-enable no-await-in-loop -- Re-enable rule after retry helper */

/**
 * Waits for common popover/listbox content to appear and returns the popup locator.
 */
export async function openAndWaitForOptions(page: Page) {
  const popup = page.locator('[role="listbox"], [role="menu"], [data-radix-popper-content-wrapper]');
  await popup.waitFor({state: "visible", timeout: 2000});
  await page.waitForTimeout(50);
  return popup;
}

/**
 * Clicks a trigger and selects an option from a popover with retries.
 */
/* eslint-disable no-await-in-loop -- Sequential retries by design for deterministic UI interactions */
export async function selectFromPopover(page: Page, trigger: Locator, option: Locator, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await trigger.scrollIntoViewIfNeeded();
      await trigger.click({timeout: 3000});

      // Try to wait for the popup; don't fail if it doesn't appear immediately.
      await openAndWaitForOptions(page).catch(() => undefined);

      await option.waitFor({state: "visible", timeout: 1500});
      await option.click({timeout: 2000});
      return;
    } catch {
      await page.waitForTimeout(150);
    }
  }
  throw new Error("Option could not be selected from popover");
}
/* eslint-enable no-await-in-loop -- Re-enable rule after retry helper */
