import test, { expect, Page } from "@playwright/test";
import { authenticate, E2E_SMOKE_NAME_PREFIX, gotoCMS } from "../helpers/global-helpers";
import { createAndPublishNews, deleteNews } from "../helpers/news-helpers";
import { MOCK_SEO } from "../mocks";

test.describe(`Checking the interaction between CMS and UI`, () => {
  let page: Page;

  test.beforeAll(async ({
    browser,
  }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await gotoCMS({ page });

    await authenticate({
      page,
    });
  });


  test.describe(`News E2E test`, () => {
    test.beforeEach(async () => {
      await deleteNews();
    });

    test.afterEach(async () => {
      await deleteNews();
    });

    test(`
      GIVEN collection of news without record
      WHEN create one news
      SHOULD see news displayed on the UI
      `,
      async () => await e2eNewsCreateAndViewTest({ page })
    );
  })
})


async function e2eNewsCreateAndViewTest({
  page
}: {
  page: Page
}) {
  const title = `${E2E_SMOKE_NAME_PREFIX} В зоопарке появился амурский тигр`;
  const description = `На фотографии изображен амурский тигр!`;
  const innerContent = `В зоопарке появился амурский тигр, приходите посмотреть!`;

  await createAndPublishNews({
    page,
    title,
    description,
    innerContent,
    filePath: `./playwright-tests/fixtures/[E2E-SMOKE]-tiger.png`,
    seo: MOCK_SEO,
  });

  await page.goto('http://localhost:3000/news', {
    waitUntil: 'networkidle'
  })

  await expect(page.getByText(title))
    .toBeVisible();

  await expect(page.getByText(description))
    .toBeVisible();

  await page.getByTestId(`cards-card`)
    .first()
    .click();

  await page.waitForTimeout(10000);

  await expect(page.getByText(innerContent))
    .toBeVisible();
}