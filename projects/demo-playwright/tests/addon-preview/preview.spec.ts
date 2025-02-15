import {TuiDocumentationPagePO, tuiGoto} from '@demo-playwright/utils';
import {expect, test} from '@playwright/test';

const {describe, beforeEach} = test;

describe(`Preview`, () => {
    describe(`Examples`, () => {
        test.use({
            viewport: {width: 500, height: 500},
        });

        let documentationPage!: TuiDocumentationPagePO;

        beforeEach(async ({page}) => {
            await tuiGoto(page, `components/preview`);
            documentationPage = new TuiDocumentationPagePO(page);
        });

        test(`Preview can be zoomed via wheel scroll`, async ({page}) => {
            const example = documentationPage.getExample(`#default`);
            const preview = page.locator(`tui-preview`);

            await example.getByRole(`button`).click();
            await expect(preview).toBeAttached();
            await page.waitForLoadState(`networkidle`);

            await preview.click(); // requires for mouse wheel
            await page.mouse.wheel(0, -50);

            await expect(preview).toHaveScreenshot(`01-preview-zoom-by-wheel.png`);
        });

        test(`No preview available`, async ({page}) => {
            const example = documentationPage.getExample(`#loading`);
            const preview = page.locator(`tui-preview`);

            await example.getByRole(`button`).click();
            await expect(preview).toBeAttached();

            await documentationPage.hideContent();
            await expect(preview).toHaveScreenshot(`02-preview-unavailable.png`);
        });
    });
});
