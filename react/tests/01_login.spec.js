import { test, expect } from '@playwright/test';

test('go to login page', async({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', {name:'Login'})).toBeVisible();
});

test('invalid user login', async( { page }) => {
    await page.goto('/');

    page.once('dialog', async(dialog) => {
        expect(dialog.message()).toContain('wrong email and password');
        await dialog.accept();
    });

    await page.getByLabel('email').fill('test123@test');
    await page.getByLabel('password').fill('test123');

    await page.click('button[type="submit"]');
    
    await expect(page.getByRole('heading', {name:'Login'})).toBeVisible();
});

test('valid user login', async( { page }) => {
    await page.goto('/');

    await page.getByLabel('email').fill('testuser@test');
    await page.getByLabel('password').fill('testuser');
    
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/home/, {timeout:60000});
    await page.context().storageState({ path: 'tests/auth.json' });
    await expect(page.getByRole('heading', {name:'Welcome to Library'})).toBeVisible();
});