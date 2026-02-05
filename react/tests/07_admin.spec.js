import { test, expect } from '@playwright/test';

test('valid admin user login', async( { page, }, testInfo) => {
    await page.goto('/');

    await page.getByLabel('email').fill('admintestuser@test');
    await page.getByLabel('password').fill('admintestuser');
    
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/admin/, {timeout:60000});
    await page.context().storageState({ path: 'tests/admin_auth.json' });
    await expect(page.getByRole('heading', {name:'Welcome to Admin Page'})).toBeVisible();
});


test.describe('Admin Page', () => {

    test.use({storageState: 'tests/admin_auth.json'});

    test.beforeEach(async({ page }) =>{	
        await page.goto('/admin');
    });

    test('load admin page', async({ page }) => {
        await expect(page.getByRole('heading', {name:'Welcome to Admin Page'})).toBeVisible();
    });

    test('go to users page', async({ page }) => {
        await (page.getByRole('button', {name:'Users'})).click(); 
        await expect(page).toHaveURL(/users/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'All Available Users'})).toBeVisible();
    });

     test('go to books page', async({ page }) => {
        await (page.getByRole('button', {name:'Books'})).click(); 
        await expect(page).toHaveURL(/books/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'All Books'})).toBeVisible();
    });

     test('go to requests page', async({ page }) => {
        await (page.getByRole('button', {name:'Requests'})).click(); 
        await expect(page).toHaveURL(/requests/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'All Requests'})).toBeVisible();
    });

});