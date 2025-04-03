import { Page, test as setup } from "@playwright/test";
import path from 'path';
import { authenticate, getStrapiUrl, gotoCMS } from './e2e/helpers/global-helpers';
import fs from 'fs';

const AUTH_FILE = path.join(__dirname, '/.auth/user.json');

const FILE_PATHS = [
  `./playwright-tests/e2e/fixtures/[E2E-SMOKE]-tiger.png`,
  `./playwright-tests/e2e/fixtures/[E2E-SMOKE]-new-document.pdf`,
  `./playwright-tests/e2e/fixtures/[E2E-SMOKE]-text-and-media-video.mp4`
];

setup('authenticate and upload test files', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await gotoCMS({ page });
  await authenticate({ page });

  await page.waitForURL(getStrapiUrl({ path: '/admin' }));

  const sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));

  const authDir = path.dirname(AUTH_FILE);
  fs.mkdirSync(authDir, { recursive: true });

  fs.writeFileSync(AUTH_FILE, sessionStorage, 'utf-8');

  await page.locator('a[aria-label="Media Library"]')
    .click();

  await uploadFiles({
    page,
  });
});

async function uploadFiles({
  page,
}: {
  page: Page
}) {
  for (const path of FILE_PATHS) {
    await page.getByRole(`button`, {
      name: `Add new assets`,
    })
      .first()
      .click();

    await page.locator('input[name="files"]')
      .setInputFiles(path);
  }

  await page.getByText(`Upload ${FILE_PATHS.length} assets to the library`)
    .click();
}