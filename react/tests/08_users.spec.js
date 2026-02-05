import { test, expect } from '@playwright/test';

test.use({storageState: 'tests/admin_auth.json'});

test.describe('Admin Users Page', () => {

    test.beforeEach(async({ page }) =>{	
        await page.goto('/admin/users');
    });

    test('load admin user page', async({ page }) => {
        await expect(page.getByRole('heading', {name:'All Available Users'})).toBeVisible({timeout:60000});
    });

    test('click and close add new users', async({ page }) => {
        await (page.getByRole('button', {name:'Add a new user'})).click(); 

        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible({timeout:60000});
        await expect(modal).toContainText('New User');
        await (modal.getByRole('button', {name:'Close'})).click(); 
        await expect(modal).not.toBeVisible({timeout:60000});

    });

    test('add a new users', async({ page }) => {
        await (page.getByRole('button', {name:'Add a new user'})).click(); 

        await page.route('/signup/', async (route) => {
            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'success' }),
            });
        });

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Account Created');
            await dialog.accept();
        });

        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible({timeout:60000});
        await expect(modal).toContainText('New User');
        await page.getByLabel('name').fill('playwright');
        await page.getByLabel('email').fill('playwright@test');
        await page.getByLabel('password').fill('playwright');

        await (modal.getByRole('button', {name:'Add'})).click(); 
        
        await expect(page.getByRole('heading', {name:'Welcome to Admin Page'})).toBeVisible({timeout:60000});

    });

    test('add a new user with existing email', async({ page }) => {
        await (page.getByRole('button', {name:'Add a new user'})).click(); 

        await page.route('/signup/', async (route) => {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({ message: 'email exists' }),
            });
        });

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Email exists. Use another email');
            await dialog.accept();
        });

        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible({timeout:60000});
        await expect(modal).toContainText('New User');
        await page.getByLabel('name').fill('playwright');
        await page.getByLabel('email').fill('playwright@test');
        await page.getByLabel('password').fill('playwright');

        await (modal.getByRole('button', {name:'Add'})).click(); 
        
        await expect(modal).toBeVisible({timeout:60000});
    });

    test('reset password', async({ page }) => {
        await page.route('/admin/user/resetpsw/', async (route) => {
            await route.fulfill({
                status: 200,
            });
        });

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Enter the new password:');
            await dialog.accept('play');
        });

        await (page.getByRole('button', {name:'Reset Password'}).first()).click(); 

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Password Reset Suceessful');
            await dialog.accept();
        });

        await expect(page.getByRole('heading', {name:'All Available Users'})).toBeVisible({timeout:60000});


    });

    
    test('valid update account', async({ page }) => {


        await (page.getByRole('button', {name:'Edit Account'}).nth(1)).click(); 
        await expect(page).toHaveURL(/update/, {timeout:60000});

        await page.route('/admin/user/update/*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ Name: 'test', Email: 'test@test' }),
            });
        });


        await expect(page.getByRole('heading', {name:'Update Info'})).toBeVisible();

        await page.locator('input[name=Name]').fill('playwright');
        await page.locator('input[name=Email]').fill('playwright@test');

        await page.route('/admin/user/update/*', async (route) => {
            await route.fulfill({
                status: 200,
            });
        });


        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Updated Suceessfully',{timeout:60000});
            await dialog.accept();
        });
        
        await (page.getByRole('button', {name:'Update'})).click(); 

        await expect(page.getByRole('heading', {name:'Update Info'})).toBeVisible({timeout:60000});


    });

    test('failed update account', async({ page }) => {


        await (page.getByRole('button', {name:'Edit Account'}).first()).click(); 
        await expect(page).toHaveURL(/update/, {timeout:60000});

        await page.route('/admin/user/update/*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ Name: 'test', Email: 'test@test' }),
            });
        });


        await expect(page.getByRole('heading', {name:'Update Info'})).toBeVisible({timeout:60000});

        await page.locator('input[name=Name]').fill('playwright');
        await page.locator('input[name=Email]').fill('playwright@test');

        await page.route('/admin/user/update/*', async (route) => {
            await route.fulfill({
                status: 500,
            });
        });

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Failed, Try Again',{timeout:60000});
            await dialog.accept();
        });

        await (page.getByRole('button', {name:'Update'})).click(); 

        await expect(page.getByRole('heading', {name:'Update Info'})).toBeVisible({timeout:60000});

    });

    test('close update account', async({ page }) => {

        await (page.getByRole('button', {name:'Edit Account'}).first()).click(); 
        await expect(page).toHaveURL(/update/, {timeout:60000});
        await expect(page.getByRole('heading', {name:'Update Info'})).toBeVisible({timeout:60000});

        await (page.getByRole('link', {name:'Cancel'})).click(); 

        await expect(page.getByRole('heading', {name:'Welcome to Admin Page'})).toBeVisible({timeout:60000});


    });

    test('delete account', async({ page }) => {

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Are you sure you want to delete this account?');
            await dialog.accept();
        });
        
        await page.route('/admin/user/delete/', async (route) => {
            await route.fulfill({
                status: 200,
            });
        });

        await (page.getByRole('button', {name:'Delete Account'}).first()).click(); 

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Account Deletion Suceessful',{timeout:60000});
            await dialog.accept();
        });

        await expect(page.getByRole('heading', {name:'All Available Users'})).toBeVisible({timeout:60000});



    });

    test('cancel delete account', async({ page }) => {

        await (page.getByRole('button', {name:'Delete Account'}).first()).click(); 

        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Are you sure you want to delete this account?',{timeout:60000});
            await dialog.dismiss();
        });

    });

});