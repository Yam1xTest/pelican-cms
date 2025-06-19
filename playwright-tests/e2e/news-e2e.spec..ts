
import { Page } from "@playwright/test";
import { expect, test } from "../helpers/api-test-fixtures";
import { authenticate, createSeo, gotoCMS, clickPublishButton, chooseFile, E2E_SMOKE_NAME_PREFIX, gotoUI } from "../helpers/global-helpers";
import { MOCK_SEO } from "../mocks";
import { SeoBlock } from "../types";
import { deleteNewsByTitle } from "../helpers/news-helper";

const NEWS_TITLE = `${E2E_SMOKE_NAME_PREFIX} В зоопарке появился амурский тигр`;
const NEWS_DESCRIPTION = `На фотографии изображен амурский тигр!`;
const INNER_CONTENT = `В зоопарке появился амурский тигр, приходите посмотреть!`;

test.describe(`News E2E tests`, () => {
  let page: Page;

  test.beforeEach(async ({
    browser,
    apiRequest
  }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await gotoCMS({ page });

    await authenticate({
      page,
    });

    await deleteNewsByTitle({
      apiRequest,
      title: NEWS_TITLE
    });
  });

  test.afterEach(async ({ apiRequest }) => {
    await deleteNewsByTitle({
      apiRequest,
      title: NEWS_TITLE
    });
  });

  test(`
    GIVEN collection of news without record
    WHEN create one news
    SHOULD see news displayed on the UI
    `,
    async () => await e2eNewsCreateAndViewTest({ page })
  );
})

async function e2eNewsCreateAndViewTest({
  page
}: {
  page: Page
}) {
  await createAndPublishNews({
    page,
    title: NEWS_TITLE,
    description: NEWS_DESCRIPTION,
    innerContent: INNER_CONTENT,
    seo: MOCK_SEO,
  });

  await gotoUI({
    page,
    path: '/news'
  })

  await expect(page.getByText(NEWS_TITLE))
    .toBeVisible();

  await expect(page.getByText(NEWS_DESCRIPTION))
    .toBeVisible();

  await page.getByTestId(`cards-card`)
    .first()
    .click();

  await expect(page.getByText(INNER_CONTENT))
    .toBeVisible();


  const metaTitle = await page.$eval(
    'head title',
    (el) => el.innerHTML
  );

  expect(metaTitle).toBe(MOCK_SEO.metaTitle);

  const metaDescription = await page.$eval(
    'head meta[name="description"]',
    (el) => el.getAttribute('content')
  );

  expect(metaDescription).toBe(MOCK_SEO.metaDescription);

  const metaKeywords = await page.$eval(
    'head meta[name="keywords"]',
    (el) => el.getAttribute('content')
  );

  expect(metaKeywords).toBe(MOCK_SEO.keywords);
}

export async function createAndPublishNews({
  page,
  title,
  description,
  innerContent,
  seo
}: {
  page: Page,
  title: string,
  description: string,
  innerContent: string,
  seo: SeoBlock
}) {
  await page.locator('a[aria-label="Content Manager"]')
    .click();

  await page.locator(`a`, {
    hasText: 'Новости'
  })
    .click();

  await page.getByText(`Create new entry`)
    .first()
    .click();

  await page.locator('[name="title"]')
    .fill(title);

  await page.locator(`[name="description"]`)
    .fill(description);

  await chooseFile({
    page,
  });

  await page.locator(`.ck-content`)
    .fill(innerContent);

  await createSeo({
    page,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    keywords: seo.keywords,
  });

  await clickPublishButton({ page });
}