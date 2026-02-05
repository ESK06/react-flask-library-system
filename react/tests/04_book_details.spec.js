import { test, expect } from '@playwright/test';

test.use({storageState: 'tests/auth.json'});

test.describe('Book Details Page', () => {

    test.beforeEach(async({ page }) =>{
        await page.goto('/browse');
    });

    test('request a book', async({ page }) => {
        await (page.getByRole('heading', {name:'Life of Pi'})).click();

        await expect(page).toHaveURL(/browse/, {timeout:60000});
        await expect(page.getByText('2001')).toBeVisible();

        await page.route('/request/protected/add/*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'success' }),
            });
        });

        
        const requestButton = page.locator('button.btn.btn-success');
        await requestButton.click();

        await expect(requestButton).toHaveText('Requested', { timeout: 60000 });
        await expect(requestButton).toBeDisabled();

    });

    test('wishlist a book', async({ page }) => {
        await (page.getByRole('heading', {name:'Pride and Prejudice'})).click();
        
        await expect(page).toHaveURL(/browse/, {timeout:60000});
        await expect(page.getByText('Romance')).toBeVisible();

        await page.route('/wishlist/protected/add/*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'success' }),
            });
        });

        
        await (page.getByRole('button', {name:'Wishlist Book'})).click();
        await expect(page.getByRole('button', {name:'Wishlisted'})).toHaveText('Wishlisted');

    });

    test('remove a book from wishlist', async({ page }) => {
        await page.route('/wishlist/protected/check/*', async (route) => {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'exists' }),
            });
        });


        await (page.getByRole('heading', {name:'Pride and Prejudice'})).click();
        await expect(page).toHaveURL(/browse/, {timeout:60000});
        await expect(page.getByText('Romance')).toBeVisible();


        await page.route('/wishlist/protected/remove/*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'success' }),
            });
        });

        await (page.getByRole('button', {name:'Wishlisted'})).click();
        await expect(page.getByRole('button', {name:'Wishlist Book'})).toHaveText('Wishlist Book');

    });


});
 