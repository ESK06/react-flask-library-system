import { test, expect } from '@playwright/test';

test.use({storageState: 'tests/admin_auth.json'});

test.describe('Admin Books Page', () => {

    test.beforeEach(async({ page }) =>{	
        await page.goto('/admin/books');
    });

    test('load admin books page', async({ page }) => {
        await expect(page.getByRole('heading', {name:'All Books'})).toBeVisible({timeout:60000});
    });

    test('click and close add a new book', async({ page }) => {
        await (page.getByRole('button', {name:'Add a new Book'})).click(); 

        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible({timeout:60000});
        await expect(modal).toContainText('New Book');
        await (modal.getByRole('button', {name:'Close'})).click(); 
        await expect(modal).not.toBeVisible({timeout:60000});

    });

    test('add a new book', async({ page }) => {
        await (page.getByRole('button', {name:'Add a new Book'})).click(); 

        await page.route('/admin/books/add/', async (route) => {
            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'success' }),
            });
        });

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Book added');
            await dialog.accept();
        });

        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible({timeout:60000});
        await expect(modal).toContainText('New Book');
        await page.getByLabel('Title').fill('playwright');
        await page.getByLabel('Author').fill('playwright');
        await page.getByLabel('Genre').fill('playwright');
        await page.getByLabel('Year').fill('0000');
        await page.getByLabel('Description').fill('playwright');

        await (modal.getByRole('button', {name:'Add'})).click(); 
        
        await expect(page.getByRole('heading', {name:'Welcome to Admin Page'})).toBeVisible({timeout:60000});

    });

    test('valid book update', async({ page }) => {


        await (page.getByRole('button', {name:'Edit'}).first()).click(); 
        await expect(page).toHaveURL(/update/, {timeout:60000});

        await page.route('/admin/books/update/*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ Title: 'test', Author: 'test', Genre: 'test', Year: '0000',
                    Description: 'test'}),
            });
        });

        await expect(page.getByRole('heading', {name:'Update Info'})).toBeVisible();

        await page.locator('input[name=Title]').fill('playwright');
        await page.locator('input[name=Author]').fill('playwright');
        await page.locator('input[name=Genre]').fill('playwright');
        await page.locator('input[name=Year]').fill('0000');
        await page.locator('textarea[name=Description]').fill('playwright');

         await page.route('/admin/books/update/*', async (route) => {
            await route.fulfill({
                status: 200,
            });
        });

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Updated Suceessfully',{timeout:60000});
            await dialog.accept();
        });
        
        await (page.getByRole('button', {name:'Update'})).click(); 


    });

    test('failed book update', async({ page }) => {

        await (page.getByRole('button', {name:'Edit'}).first()).click(); 
        await expect(page).toHaveURL(/update/, {timeout:60000});

        await page.route('/admin/books/update/*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ Title: 'test', Author: 'test', Genre: 'test', Year: '0000',
                    Description: 'test'}),
            });
        });


        await expect(page.getByRole('heading', {name:'Update Info'})).toBeVisible();

        await page.locator('input[name=Title]').fill('playwright');
        await page.locator('input[name=Author]').fill('playwright');
        await page.locator('input[name=Genre]').fill('playwright');
        await page.locator('input[name=Year]').fill('0000');
        await page.locator('textarea[name=Description]').fill('playwright');

        await page.route('/admin/books/update/*', async (route) => {
            await route.fulfill({
                status: 500,
            });
        });

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Failed, Try Again');
            await dialog.accept();
        });
        
        await (page.getByRole('button', {name:'Update'})).click(); 


    });

    test('close book update', async({ page }) => {

        await (page.getByRole('button', {name:'Edit'}).first()).click();
        await expect(page).toHaveURL(/update/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'Update Info'})).toBeVisible();

        await (page.getByRole('link', {name:'Cancel'})).click(); 

        await expect(page.getByRole('heading', {name:'Welcome to Admin Page'})).toBeVisible({timeout:60000});

    });

    test('delete book', async({ page }) => {

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Are you sure you want to delete this book?');
            await dialog.accept();
        });

        await page.route('/admin/books/delete/', async (route) => {
            await route.fulfill({
                status: 200,
            });
        });

        await (page.getByRole('button', {name:'Remove'}).first()).click(); 

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Book Deletion Suceessful', {timeout:60000});
            await dialog.accept();
        });

                await expect(page.getByRole('heading', {name:'All Books'})).toBeVisible({timeout:60000});



    });

    test('cancel delete book', async({ page }) => {
        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Are you sure you want to delete this book?');
            await dialog.dismiss();
        });

        await (page.getByRole('button', {name:'Remove'}).first()).click(); 

    });

});
