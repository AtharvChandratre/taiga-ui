import {TuiDocumentationPagePO, tuiGoto} from '@demo-playwright/utils';
import {expect, test} from '@playwright/test';

test.describe(`Table`, () => {
    test(`Dynamic column`, async ({page}) => {
        await tuiGoto(page, `components/table`);
        const example = new TuiDocumentationPagePO(page).getExample(`#dynamic`);
        const dynamicButton = example.locator(`button`).first();

        await dynamicButton.click();
        await expect(example).toHaveScreenshot(`01-table-dynamic-chromium-darwin.png`);
    });
});
