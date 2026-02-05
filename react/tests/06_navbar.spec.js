import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/auth.json' });

test.describe('Navigation Bar', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/home');
    });

    test('click my profile', async ({ page }) => {
        await (page.getByRole('link', { name: 'My Profile' })).click();
        await expect(page).toHaveURL(/profile/, { timeout: 60000 });
        await expect(page.getByRole('heading', { name: 'Update Your Details' })).toBeVisible();
    });
  
    test('click home', async({ page }) => {
        await (page.getByRole('link', {name:'Home'})).click();
        await expect(page).toHaveURL(/home/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'Welcome to Library'})).toBeVisible();
    });

    test('admin panel not visible', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Admin Panel' })).toBeHidden();
    });

});