import { test, expect } from '@playwright/test';

test('login goes to HOME_ROUTE from env', async ({ page }) => {
  await page.goto('/en/login');
  await page.locator('input[name="tenant"]').fill('Türkiye');
  await page.locator('input[name="username"]').fill('admin');
  await page.locator('input[name="password"]').fill('1q2w3E*');
  const form = page.locator('form').first();
  await form.getByTestId('login-button').click();
  await expect(page).toHaveURL(`/en${process.env.HOME_ROUTE}`);
});