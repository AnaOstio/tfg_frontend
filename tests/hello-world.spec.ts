import { test, expect } from '@playwright/test';

test('should display the homepage', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/TFG/);
    const loginText = page.getByText('INICIAR SESIÓN', { exact: true })
    await expect(loginText).toBeVisible()
});