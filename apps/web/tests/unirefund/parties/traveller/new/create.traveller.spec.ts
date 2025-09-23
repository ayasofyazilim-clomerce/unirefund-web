import {test, expect} from "@playwright/test";
import {appReady} from "tests/unirefund/_support/app-ready";

async function fillDateInput(
  page: import("@playwright/test").Page,
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

function randDigits(len: number): string {
  return Array.from({length: len}, () => Math.floor(Math.random() * 10)).join("");
}

async function fillStable(
  page: import("@playwright/test").Page,
  locator: import("@playwright/test").Locator,
  value: string,
  opts?: {hard?: boolean},
): Promise<void> {
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

test("traveller form - stable random", async ({page}) => {
  test.setTimeout(45_000);
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const randomFirstName = `Admin-${unique}`;
  const randomLastName = `Test-${unique}`;
  const randomDocNumber = `ID${randDigits(6)}`;

  await page.goto("/en/parties/travellers/new");
  await appReady(page);
  const by = (id: string) => page.getByTestId(id);

  await by("root_travellerDocument_identificationType").click();
  await by("root_travellerDocument_identificationType_IdCard").click();
  await fillStable(page, by("root_travellerDocument_travelDocumentNumber"), randomDocNumber, {});
  await fillStable(page, by("root_travellerDocument_firstName"), randomFirstName, {});
  await fillStable(page, by("root_travellerDocument_lastName"), randomLastName, {});
  await fillDateInput(page, "root_travellerDocument_birthDate_calendar_input_1", {
    day: "23",
    month: "09",
    year: "1990",
  });
  await fillDateInput(page, "root_travellerDocument_expirationDate_calendar_input_1", {
    day: "23",
    month: "09",
    year: "2030",
  });
  await fillDateInput(page, "root_travellerDocument_issueDate_calendar_input_1", {
    day: "23",
    month: "09",
    year: "2030",
  });

  await page.locator('[id^="react-aria"]').first().click();

  await by("root_travellerDocument_residenceCountryCode2").click();
  await page.locator('[data-value="türkiye" i]').click();

  await fillStable(page, by("root_firstName"), randomFirstName, {});
  await fillStable(page, by("root_lastName"), randomLastName, {});
  await fillDateInput(page, "root_birthDate_calendar_input_1", {day: "23", month: "09", year: "1990"});
  await by("root_travellerDocument_nationalityCountryCode2").click();
  await page.locator('[data-value="türkiye" i]').click();
  await by("root_languagePreferenceCultureName").click();
  await by("root_languagePreferenceCultureName_tr").click();
  await by("root_gender").click();
  await by("root_gender_MALE").click();
  const prevUrl = page.url();
  await by("new-traveller-form_submit").click();

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
  // Assert the created traveller appears in the table
  const expectedName = `${randomFirstName} ${randomLastName}`;
  const recordLink = page.locator(`a`, {hasText: expectedName});
  await expect(recordLink).toBeVisible({timeout: 10000});
});
