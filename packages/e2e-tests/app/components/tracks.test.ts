import { test, expect } from '@playwright/test'

test.describe('Tracks page', () => {
    test('should load and display tracks list', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByTestId('tracks-header')).toBeVisible();
        await expect(page.getByTestId('data-table')).toBeVisible();
        await page.waitForSelector('[data-loading="false"]');
        await expect(page.getByTestId(/track-item-\d+$/)).toHaveCount(10);
    });

    test('should filter tracks by search term', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('[data-loading="false"]');
        await page.fill('[data-testid="search-input"]', 'test song 1 with a long non-existent name');
        await page.waitForTimeout(500);
        await expect(page).toHaveURL('?search=test+song+1+with+a+long+non-existent+name');
        await expect(page.getByTestId(/track-item-\d+$/)).toHaveCount(0);

        await page.reload();
        await page.waitForSelector('[data-loading="false"]');
        await expect(page.locator('[data-testid="search-input"]')).toHaveValue('test song 1 with a long non-existent name');
    });

    test('should change items per page', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('[data-loading="false"]');
        await page.getByTestId('limit-select').click();
        await page.getByRole('option', { name: '5', exact: true }).click();
        await expect(page).toHaveURL('/?limit=5');
        await expect(page.getByTestId(/track-item-\d+$/)).toHaveCount(5);

        await page.reload();
        await page.waitForSelector('[data-loading="false"]');
        await expect(page.getByTestId('limit-select')).toHaveText('5');
    });
})