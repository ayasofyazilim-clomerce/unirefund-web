import {test, expect} from "@playwright/test";

test("auth", async ({page}) => {
  test.setTimeout(45_000);

  await page.goto("/en/login");
  await page.locator('input[name="tenant"]').fill(process.env.TEST_TENANT || "");
  await page.locator('input[name="username"]').fill(process.env.ADMIN_USERNAME || "");
  await page.locator('input[name="password"]').fill(process.env.ADMIN_PASSWORD || "");
  const form = page.locator("form").first();
  await form.getByTestId("login-button").click();
  await expect(page).toHaveURL(`/en${process.env.HOME_ROUTE}`);
  await page.context().storageState({path: "apps/web/tests/core/auth.json"});
});
