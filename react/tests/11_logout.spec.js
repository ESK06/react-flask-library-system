import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/auth.json' });

test('click logout', async ({ page }) => {
    await page.goto('/home');
    await (page.getByRole('button', { name: 'Logout' })).click();
    await expect(page).toHaveURL('/', { timeout: 60000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible({ timeout: 60000 });
});