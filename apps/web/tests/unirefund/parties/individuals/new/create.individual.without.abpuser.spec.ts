import type {Locator, Page} from "@playwright/test";
import {expect, test} from "@playwright/test";
import {safeClick, selectFromPopover} from "tests/unirefund/_support/retry-utils";

async function fillDateInput(
  page: Page,
  calendarTestId: string,
  {day, month, year}: {day: string; month: string; year: string},
): Promise<void> {
  const calendar = page.getByTestId(calendarTestId);
  const monthSpin = calendar.getByRole("spinbutton", {name: /month/i});
  const daySpin = calendar.getByRole("spinbutton", {name: /day/i});
  const yearSpin = calendar.getByRole("spinbutton", {name: /year/i});

  await monthSpin.waitFor({state: "visible", timeout: 5000});
  await monthSpin.click();
  await monthSpin.fill("");
  await monthSpin.type(month);

  await daySpin.waitFor({state: "visible", timeout: 5000});
  await daySpin.click();
  await daySpin.fill("");
  await daySpin.type(day);

  await yearSpin.waitFor({state: "visible", timeout: 5000});
  await yearSpin.click();
  await yearSpin.fill("");
  await yearSpin.type(year);
}

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

test("create individual - stable random", async ({page}) => {
  test.setTimeout(45_000);

  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const randomFirstname = `Admin-${unique}`;
  const randomLastname = `Test-${unique}`;
  const randomIdentificationNumber = randDigits(11);
  const randomNotes = `Note-${unique}`;
  const randomPhone = "5555555555";
  const randomEmail = `random${unique}@random.com`;

  await page.goto("/en/parties/individuals/new");
  const by = (id: string) => page.getByTestId(id);

  await fillStable(page, by("root_firstname"), randomFirstname);
  await fillStable(page, by("root_lastname"), randomLastname);

  await selectFromPopover(page, by("root_gender"), by("root_gender_MALE"));
  await fillDateInput(page, "root_birthDate_calendar_input_1", {day: "23", month: "09", year: "1990"});

  await fillStable(page, by("root_identificationNumber"), randomIdentificationNumber);

  await page.getByRole("spinbutton", {name: "month, x"}).click();

  await fillStable(page, by("root_notes"), randomNotes);

  await fillPhoneTR(page, by("phone"), randomPhone);

  await safeClick(by("type-select"));
  await by("type_2").getByText("Work").click();

  await fillStable(page, by("root_email_emailAddress"), randomEmail);
  await safeClick(by("root_email_type"));
  await by("root_email_type_WORK").click();

  const prevUrl = page.url();
  await by("create-individual-form_submit").click();

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

  const idInput = by("root_identificationNumber");
  await idInput.waitFor({state: "attached", timeout: 5000});
  await expect.soft(idInput).toHaveValue(randomIdentificationNumber, {timeout: 5000});
});
