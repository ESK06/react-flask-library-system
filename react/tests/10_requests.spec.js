import { test, expect } from '@playwright/test';

test.use({storageState: 'tests/admin_auth.json'});

test.describe('Admin Requests Page', () => {

    test.beforeEach(async({ page }) =>{	
        await page.goto('/admin/requests');
    });

    test('load admin requests page', async({ page }) => {
        await expect(page.getByRole('heading', {name:'All Requests'})).toBeVisible({timeout:60000});
    });

    test('accept a request', async({ page }) => {


        await page.route('/admin/requests/update/', async (route) => {
            await route.fulfill({
                status: 200,
            });
        });

        await (page.getByRole('button', {name:'Accept'}).first()).click(); 


        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Request accepted/declined Suceessfully');
            await dialog.accept();
        });

        await page.route('/admin/requests/history/get/', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ title: 'playwright', user_name: 'test', 
                        user_email : 'test@test',
                        status : 'Accepted' }]),
            });
        });

        await page.reload({timeout:60000});


        await expect(page.getByRole('heading', {name:'Request History'})).toBeVisible({timeout:60000});


        await expect(page.getByText('playwright')).toBeVisible({timeout:60000});
        await expect(page.getByText('Accepted')).toBeVisible({timeout:60000});

    });

    test('decline a request', async({ page }) => {


        await page.route('/admin/requests/update/', async (route) => {
            await route.fulfill({
                status: 200,
            });
        });

        await (page.getByRole('button', {name:'Decline'}).first()).click(); 


        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Request accepted/declined Suceessfully');
            await dialog.accept();
        });

        await page.route('/admin/requests/history/get/', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ title: 'playwright', user_name: 'test', 
                        user_email : 'test@test',
                        status : 'Declined' }]),
            });
        });

        await page.reload({timeout:60000});


        await expect(page.getByRole('heading', {name:'Request History'})).toBeVisible({timeout:60000});


        await expect(page.getByText('playwright')).toBeVisible({timeout:60000});
        await expect(page.getByText('Declined')).toBeVisible({timeout:60000});

    });

});
