import { test, expect } from '@playwright/test';

test.use({storageState: 'tests/auth.json'});

test.describe('Home Page', () => {

    test.beforeEach(async({ page }) =>{
        await page.goto('/home');
    });

    test('load homepage', async({ page }) => {
        await expect(page.getByRole('heading', {name:/Welcome to Library/i})).toBeVisible({timeout:60000});

    });

    test('go to your history page', async({ page }) => {
        await (page.getByRole('button', {name:'Your History'})).click(); 
        await expect(page).toHaveURL(/history/, {timeout:60000});
        await expect(page.getByText('Your Requested History')).toBeVisible();
        //await expect(page.getByRole('heading', {name:'Your Requested History'})).toBeVisible();
    });

    test('go to my wishlist page', async({ page }) => {
        await (page.getByRole('button', {name:'My Wishlist'})).click(); 
        await expect(page).toHaveURL(/wishlist/, {timeout:60000});
        await expect(page.getByText('Your Wishlisted Books')).toBeVisible();
        //await expect(page.getByRole('heading', {name:'Your Wishlisted Books'})).toBeVisible();
    });

    test('go to my browse page', async({ page }) => {
        await (page.getByRole('button', {name:'Browse Books'})).click(); 
        await expect(page).toHaveURL(/browse/, {timeout:60000});
        await expect(page.getByText('Available Books')).toBeVisible();
        //await expect(page.getByRole('heading', {name:'Available Books'})).toBeVisible();
    });

   test('search box interaction', async({ page }) => {
        await page.getByPlaceholder('Enter Book Name').fill('Life of Pi');
        await (page.getByRole('button', {name:'Search'})).click(); 
        await expect(page).toHaveURL(/results/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'Results'})).toBeVisible();
    }); 

    test('search box interaction with 1000 letters', async({ page }) => {
        const text = 'a'.repeat(1000);
        await page.getByPlaceholder('Enter Book Name').fill(text);
        await (page.getByRole('button', {name:'Search'})).click(); 
        await expect(page).toHaveURL(/results/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'Results'})).toBeVisible();
    });

    //failed due to input accept empty values
    test.fixme('search button disabled if search input empty', async({ page }) => {
        await page.getByPlaceholder('Enter Book Name').fill('');
        await expect(page.getByRole('button', {name:'Search'})).toBeDisabled(); 
    }); 
});