import type {Locator, Page} from "@playwright/test";
import {expect, test} from "@playwright/test";
import {appReady} from "tests/unirefund/_support/app-ready";
import {safeClick} from "tests/unirefund/_support/retry-utils";

function randDigits(len: number) {
  return Array.from({length: len}, () => Math.floor(Math.random() * 10)).join("");
}

async function fillStable(page: Page, locator: Locator, value: string, opts?: {hard?: boolean}) {
  await locator.waitFor({state: "visible", timeout: 15000});
  await expect(locator).toBeEditable({timeout: 15000});
  async function tryFill(attempts: number): Promise<void> {
    await locator.click({timeout: 5000});
    await page.waitForTimeout(100);
    await locator.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
    await locator.press("Delete");
    await locator.fill(value);
    const current = await locator.inputValue();
    if (current === value || attempts >= 2) return;
    await page.waitForTimeout(200);
    await tryFill(attempts + 1);
  }
  await tryFill(0);
  if (opts?.hard) {
    await expect(locator).toHaveValue(value);
  } else {
    await expect.soft(locator).toHaveValue(value);
  }
}

const digitsOnly = (s: string) => (s || "").replace(/\D/g, "");

async function fillPhoneTR(page: Page, locator: Locator, rawDigits: string) {
  const expectedDigits = `90${digitsOnly(rawDigits)}`;

  await locator.waitFor({state: "visible", timeout: 15000});
  await expect(locator).toBeEditable({timeout: 15000});
  await locator.scrollIntoViewIfNeeded();

  await locator.click();
  await locator.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await locator.press("Delete");

  await locator.type("+90");
  await expect.poll(async () => (await locator.inputValue()).startsWith("+90")).toBeTruthy();

  const local = digitsOnly(rawDigits);
  await locator.type(local);

  const got = digitsOnly(await locator.inputValue());
  expect.soft(got).toBe(expectedDigits);
}

test("create tax office", async ({page}) => {
  test.setTimeout(45_000);
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const randomName = `Mavi-${unique}`;
  const randomExternalId = randDigits(9);

  await page.goto("/en/parties/tax-offices/new");
  await appReady(page);

  const by = (id: string) => page.getByTestId(id);

  await fillStable(page, by("root_name"), randomName);

  await fillStable(page, by("root_externalIdentifier"), randomExternalId);

  await fillPhoneTR(page, by("phone"), "5455454545");
  await safeClick(by("type-select"));
  await safeClick(by("type_2"));

  await fillStable(page, by("root_email_emailAddress"), "admin@abp.io");
  await safeClick(by("root_email_type"));
  await safeClick(by("root_email_type_WORK"));

  await safeClick(by("root_address_adminAreaLevel1Id-trigger"));
  await safeClick(page.locator('[data-value="adıyaman" i]'));

  await safeClick(by("root_address_adminAreaLevel2Id-trigger"));
  await safeClick(page.locator('[data-value="merkez" i]'));

  await fillStable(page, by("root_address_addressLine"), "lorem ipsum");
  await fillStable(page, by("root_address_postalCode"), "41700");

  await safeClick(by("root_address_type"));
  await safeClick(by("root_address_type_WORK"));

  const prevUrl = page.url();
  await safeClick(by("create-tax-office-form_submit"));

  await page.waitForURL(
    (url) => {
      try {
        const u = new URL(url);
        const p = new URL(prevUrl);
        return u.pathname !== p.pathname;
      } catch {
        return true;
      }
    },
    {timeout: 15000},
  );
  const nameInput = by("root_name");
  await nameInput.waitFor({state: "attached", timeout: 5000});
  await expect.soft(nameInput).toHaveValue(randomName, {timeout: 5000});
});
