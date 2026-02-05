import { test, expect } from '@playwright/test';

test.use({storageState: 'tests/admin_auth.json'});

test('click logout', async ({ page }) => {
    await page.goto('/admin');
    await (page.getByRole('button', { name: 'Logout' })).click();

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

});