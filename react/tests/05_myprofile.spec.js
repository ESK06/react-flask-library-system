import { test, expect } from '@playwright/test';

test.use({storageState: 'tests/auth.json'});

test.describe('My Profile Page', () => {

    test.beforeEach(async({ page }) =>{
        await page.goto('/profile');
    });

    test('load my profile page', async({ page }) => {
        await expect(page.getByRole('heading', {name:'Update Your Details'})).toBeVisible();
    });

    test('update user name test 1', async({ page }) => {
        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Username Updated');
            await dialog.accept();
        });
        const nameinput = page.locator('input[type="text"]');
        await nameinput.fill('testuserupdate');
        await (page.getByRole('button', {name:'Update'}).first()).click(); 
    });

    test('update user name with 1000 letters', async({ page }) => {
        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Username Updated');
            await dialog.accept();
        });
        const text = 'a'.repeat(1000);
        const nameinput = page.locator('input[type="text"]');
        await nameinput.fill(text);
        await (page.getByRole('button', {name:'Update'}).first()).click(); 
    });

    test.fixme('submit empty user name', async({ page }) => {
        await page.locator('input[type="text"]').fill('');
        await expect (page.getByRole('button', {name:'Update'}).first()).toBeDisabled(); 
    });

    test('update user name test 2', async({ page }) => {
        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Username Updated');
            await dialog.accept();
        });
        const nameinput = page.locator('input[type="text"]');
        await nameinput.fill('testuser');
        await (page.getByRole('button', {name:'Update'}).first()).click(); 
    });
    

    test('update user password test 1', async({ page }) => {
        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Password Updated Login Again');
            await dialog.accept();
        });
        const oldpasswordinput = page.locator('input[name="oldPassword"]');
        const newpasswordinput = page.locator('input[name="newPassword"]');
        const confirmpasswordinput = page.locator('input[name="confirmPassword"]');
        await oldpasswordinput.fill('testuser');
        await newpasswordinput.fill('testuserupdate');
        await confirmpasswordinput.fill('testuserupdate');
        await (page.getByRole('button', {name:'Update'}).nth(1)).click();
    });

    test('update user password with 1000 letters', async({ page }) => {
        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Password Updated Login Again');
            await dialog.accept();
        });
        const text = 'a'.repeat(1000);
        const oldpasswordinput = page.locator('input[name="oldPassword"]');
        const newpasswordinput = page.locator('input[name="newPassword"]');
        const confirmpasswordinput = page.locator('input[name="confirmPassword"]');
        await oldpasswordinput.fill('testuserupdate');
        await newpasswordinput.fill(text);
        await confirmpasswordinput.fill(text);
        await (page.getByRole('button', {name:'Update'}).nth(1)).click();
    });

    test('update user password test 2', async({ page }) => {
        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Password Updated Login Again');
            await dialog.accept();
        });
        const text = 'a'.repeat(1000);
        const oldpasswordinput = page.locator('input[name="oldPassword"]');
        const newpasswordinput = page.locator('input[name="newPassword"]');
        const confirmpasswordinput = page.locator('input[name="confirmPassword"]');
        await oldpasswordinput.fill(text);
        await newpasswordinput.fill('testuser');
        await confirmpasswordinput.fill('testuser');
        await (page.getByRole('button', {name:'Update'}).nth(1)).click();
    });

    test('update user password with mismatch passwords', async({ page }) => {
        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Password does not match');
            await dialog.accept();
        });
        const oldpasswordinput = page.locator('input[name="oldPassword"]');
        const newpasswordinput = page.locator('input[name="newPassword"]');
        const confirmpasswordinput = page.locator('input[name="confirmPassword"]');
        await oldpasswordinput.fill('testuser');
        await newpasswordinput.fill('testuserupdate12');
        await confirmpasswordinput.fill('testuserupdate');
        await (page.getByRole('button', {name:'Update'}).nth(1)).click();
    });

    test('update with wrong password', async({ page }) => {
        page.once('dialog', async(dialog) => {
            expect(dialog.message()).toContain('Password Updated Failed (Wrong Password)');
            await dialog.accept();
        });
        const oldpasswordinput = page.locator('input[name="oldPassword"]');
        const newpasswordinput = page.locator('input[name="newPassword"]');
        const confirmpasswordinput = page.locator('input[name="confirmPassword"]');
        await oldpasswordinput.fill('testuser123');
        await newpasswordinput.fill('testuserupdate');
        await confirmpasswordinput.fill('testuserupdate');
        await (page.getByRole('button', {name:'Update'}).nth(1)).click();
    });


    test.fixme('try to update user password without entering old password', async({ page }) => {
        const oldpasswordinput = page.locator('input[name="oldPassword"]');
        const newpasswordinput = page.locator('input[name="newPassword"]');
        const confirmpasswordinput = page.locator('input[name="confirmPassword"]');
        await oldpasswordinput.fill('');
        await newpasswordinput.fill('testuserupdate');
        await confirmpasswordinput.fill('testuserupdate');
        await expect(page.getByRole('button', {name:'Update'}).nth(1)).toBeDisabled();
    });

    test.fixme('try to update user password without entering new password', async({ page }) => {
        const oldpasswordinput = page.locator('input[name="oldPassword"]');
        const newpasswordinput = page.locator('input[name="newPassword"]');
        const confirmpasswordinput = page.locator('input[name="confirmPassword"]');
        await oldpasswordinput.fill('restuser');
        await newpasswordinput.fill('');
        await confirmpasswordinput.fill('testuserupdate');
        await expect(page.getByRole('button', {name:'Update'}).nth(1)).toBeDisabled();
    });

    test.fixme('try to update user password without confirming new password', async({ page }) => {
        const oldpasswordinput = page.locator('input[name="oldPassword"]');
        const newpasswordinput = page.locator('input[name="newPassword"]');
        const confirmpasswordinput = page.locator('input[name="confirmPassword"]');
        await oldpasswordinput.fill('restuser');
        await newpasswordinput.fill('testuserupdate');
        await confirmpasswordinput.fill('');
        await expect(page.getByRole('button', {name:'Update'}).nth(1)).toBeDisabled();
    });
});