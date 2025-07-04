import { test, expect } from '@playwright/test'

test.describe('Tracks page', () => {
    test.beforeEach(async ({ page }) => {
        // Log console messages from the browser
        page.on('console', (msg) => {
            console.log(`[BROWSER CONSOLE ${msg.type()}]: ${msg.text()}`);
        });

        // Log network requests and responses
        page.on('request', (request) => {
            console.log(`[NETWORK REQUEST]: ${request.method()} ${request.url()}`);
            if (request.url().includes('/api/')) {
                console.log(`[API REQUEST]: ${request.method()} ${request.url()}`);
                console.log(`[API REQUEST HEADERS]:`, request.headers());
            }
        });

        page.on('response', (response) => {
            if (response.url().includes('/api/')) {
                console.log(`[API RESPONSE]: ${response.status()} ${response.url()}`);
                console.log(`[API RESPONSE HEADERS]:`, response.headers());
            }
        });

        // Log failed requests
        page.on('requestfailed', (request) => {
            console.log(`[NETWORK FAILED]: ${request.method()} ${request.url()}`);
            console.log(`[NETWORK FAILURE REASON]:`, request.failure());
        });

        // Log page errors
        page.on('pageerror', (error) => {
            console.log(`[PAGE ERROR]:`, error.message);
        });
    });

    test('should load and display tracks list', async ({ page }) => {
        console.log('[TEST] Starting: should load and display tracks list');
        
        await page.goto('/');
        console.log('[TEST] Page loaded, waiting for elements...');
        
        await expect(page.getByTestId('tracks-header')).toBeVisible();
        console.log('[TEST] Tracks header visible');
        
        await expect(page.getByTestId('data-table')).toBeVisible();
        console.log('[TEST] Data table visible');
        
        await page.getByRole('option', { name: '10', exact: true }).click();
        console.log('[TEST] Selected 10 items per page');
        
        await page.waitForSelector('[data-loading="false"]');
        console.log('[TEST] Loading completed');
        
        // Add some debugging for the tracks count
        const trackElements = page.getByTestId(/track-item-\d+$/);
        const count = await trackElements.count();
        console.log(`[TEST] Found ${count} track elements`);
        
        // Wait a bit more and try again if no tracks found
        if (count === 0) {
            console.log('[TEST] No tracks found, waiting 2 more seconds...');
            await page.waitForTimeout(2000);
            const newCount = await trackElements.count();
            console.log(`[TEST] After waiting, found ${newCount} track elements`);
        }
        
        await expect(page.getByTestId(/track-item-\d+$/)).toHaveCount(10);
        console.log('[TEST] Successfully verified 10 tracks');
    });

    test('should filter tracks by search term', async ({ page }) => {
        console.log('[TEST] Starting: should filter tracks by search term');
        
        await page.goto('/');
        console.log('[TEST] Page loaded, waiting for loading to complete...');
        
        await page.waitForSelector('[data-loading="false"]');
        console.log('[TEST] Initial loading completed');
        
        // Log initial track count
        const initialCount = await page.getByTestId(/track-item-\d+$/).count();
        console.log(`[TEST] Initial track count: ${initialCount}`);
        
        await page.fill('[data-testid="search-input"]', 'test song 1 with a long non-existent name');
        console.log('[TEST] Filled search input');
        
        await page.waitForTimeout(500);
        console.log('[TEST] Waited for search to process');
        
        await expect(page).toHaveURL('?search=test+song+1+with+a+long+non-existent+name');
        console.log('[TEST] URL updated with search parameter');
        
        // Log track count after search
        const searchCount = await page.getByTestId(/track-item-\d+$/).count();
        console.log(`[TEST] Track count after search: ${searchCount}`);
        
        await expect(page.getByTestId(/track-item-\d+$/)).toHaveCount(0);
        console.log('[TEST] Successfully verified 0 tracks after search');

        await page.reload();
        console.log('[TEST] Page reloaded');
        
        await page.waitForSelector('[data-loading="false"]');
        console.log('[TEST] Loading completed after reload');
        
        await expect(page.locator('[data-testid="search-input"]')).toHaveValue('test song 1 with a long non-existent name');
        console.log('[TEST] Search input value preserved after reload');
    });

    test('should change items per page', async ({ page }) => {
        console.log('[TEST] Starting: should change items per page');
        
        await page.goto('/');
        console.log('[TEST] Page loaded, waiting for loading to complete...');
        
        await page.waitForSelector('[data-loading="false"]');
        console.log('[TEST] Initial loading completed');
        
        await page.getByTestId('limit-select').click();
        console.log('[TEST] Clicked limit select');
        
        await page.getByRole('option', { name: '5', exact: true }).click();
        console.log('[TEST] Selected 5 items per page');
        
        await expect(page).toHaveURL('/?limit=5');
        console.log('[TEST] URL updated with limit parameter');
        
        // Log track count after limit change
        const limitCount = await page.getByTestId(/track-item-\d+$/).count();
        console.log(`[TEST] Track count after limit change: ${limitCount}`);
        
        await expect(page.getByTestId(/track-item-\d+$/)).toHaveCount(5);
        console.log('[TEST] Successfully verified 5 tracks');

        await page.reload();
        console.log('[TEST] Page reloaded');
        
        await page.waitForSelector('[data-loading="false"]');
        console.log('[TEST] Loading completed after reload');
        
        await expect(page.getByTestId('limit-select')).toHaveText('5');
        console.log('[TEST] Limit select value preserved after reload');
    });
})