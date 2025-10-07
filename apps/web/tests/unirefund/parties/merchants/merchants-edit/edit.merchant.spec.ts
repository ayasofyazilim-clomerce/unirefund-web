import {test} from "@playwright/test";
import {appReady} from "tests/unirefund/_support/app-ready";
import {expectNewToastAfter} from "../../../_support/expect-toast";

function randomInt(min = 0, max = 1000000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPhone() {
  const n = String(5000000000 + randomInt(0, 499999999));
  return `+90 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8)}`;
}

function randomEmail() {
  return `test${Date.now() % 100000}_${randomInt(1, 999)}@example.com`;
}

function randomMerchantTitle() {
  return `Mavi-${Date.now().toString().slice(-6)}${randomInt(10, 99)}`;
}

test("merchant edit - randomized inputs", async ({page}) => {
  const base = "/en/parties/merchants";
  const title = randomMerchantTitle();
  const vat = String(7700000000 + randomInt(0, 99999999));
  const storeCode = String(760000000 + randomInt(0, 9999999));
  const phone = randomPhone();
  const email = randomEmail();

  await page.goto(base);
  await appReady(page);

  const merchantLinks = page.locator('[data-testid$="-name-link"]');
  await merchantLinks.first().waitFor({state: "visible", timeout: 5000});
  await merchantLinks
    .filter({has: page.locator(":visible")})
    .first()
    .click();

  await page.getByTestId("root_name").fill(title);
  await page.getByTestId("root_vatNumber").fill(vat);
  await page.getByTestId("root_externalIdentifier").fill(storeCode);

  await expectNewToastAfter(
    page,
    async () => {
      await page.getByTestId("schema_form_submit").click();
    },
    {text: /Updated successfully/i, type: "success"},
  );

  await page.getByTestId("expand-row-normalizedPhoneNumber").click();
  await page.getByTestId("phone").fill(phone);
  await expectNewToastAfter(
    page,
    async () => {
      await page.getByTestId("edit-telephone-form_submit").click();
    },
    {text: /Updated successfully/i, type: "success"},
  );

  await page.getByTestId("expand-row-emailAddress").click();
  await page.getByTestId("root_emailAddress").fill(email);
  await expectNewToastAfter(
    page,
    async () => {
      await page.getByTestId("edit-email-form_submit").click();
    },
    {text: /Updated successfully/i, type: "success"},
  );

  await page.getByTestId("expand-row-addressLine").click();

  await expectNewToastAfter(
    page,
    async () => {
      await page.getByTestId("edit-address-form_submit").click();
    },
    {text: /Updated successfully/i, type: "success"},
  );
});
