import { test, expect } from '@playwright/test';

test.use({storageState: 'tests/auth.json'});

test.describe('Browse Page', () => {
 
    test.beforeEach(async({ page }) =>{
        await page.goto('/browse');
    });

    test('load browse page', async({ page }) => {
        await expect(page.getByRole('heading', {name:'Available Books'})).toBeVisible();
    });

    test('select a book test 1', async({ page }) => {
        await (page.getByRole('heading', {name:'Life of Pi'})).click();
        await expect(page).toHaveURL(/browse/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'Description'})).toBeVisible();
    });

    test('select a book test 2', async({ page }) => {
        await (page.getByRole('heading', {name:'Pride and Prejudice'})).click();
        await expect(page).toHaveURL(/browse/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'Description'})).toBeVisible();
    });

});