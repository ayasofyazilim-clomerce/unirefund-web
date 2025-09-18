import {buildTaxOfficeData} from "@uni/data/builders";
import {test, expect} from "@uni/fixtures/common.fixture";
import {TaxOfficeFormPage} from "@uni/pages/tax-office-form-page";

test("create tax office", async ({page, by}) => {
  test.setTimeout(45_000);

  const data = buildTaxOfficeData();
  const form = new TaxOfficeFormPage(page);

  await form.goto();
  await form.fillCore(data.name, data.externalId, data.vat);
  await form.phone.fill(data.phone);
  await form.selectTypeWork();
  await form.email.fill(data.email);

  await form.address.selectCountry(data.address.country);
  await form.address.selectAdmin1(data.address.admin1);
  await form.address.selectAdmin2(data.address.admin2);
  await form.address.fillLineAndPostal(data.address.line, data.address.postal);
  await form.address.setTypeWork();

  const prevUrl = page.url();
  await form.submit();

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
  await expect.soft(nameInput).toHaveValue(data.name, {timeout: 5000});
});
