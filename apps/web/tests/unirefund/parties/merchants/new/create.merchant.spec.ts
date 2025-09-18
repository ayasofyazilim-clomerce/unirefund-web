import {MerchantFormPage} from "@uni/pages/merchant-form-page";
import {buildMerchantData} from "@uni/data/builders";
import {expect, test} from "@uni/fixtures/common.fixture";

test("create merchant", async ({page, h}) => {
  test.setTimeout(45_000);

  const data = buildMerchantData();
  const form = new MerchantFormPage(page);

  await form.goto();
  await form.fillCore(data.name, data.chainCodeId, data.externalId, data.vat);
  await form.phone.fill(data.phone);
  await form.selectTypeWork();
  await form.email.fill(data.email);

  await form.address.selectCountry(data.address.country);
  await form.address.selectAdmin1(data.address.admin1);
  await form.address.selectAdmin2(data.address.admin2);
  await form.address.fillLineAndPostal(data.address.line, data.address.postal);
  await form.address.setTypeWork();

  await form.submit();

  const nameInput = h.by("root_name");
  await nameInput.waitFor({state: "attached", timeout: 5000});
  await expect.soft(nameInput).toHaveValue(data.name, {timeout: 5000});
});
