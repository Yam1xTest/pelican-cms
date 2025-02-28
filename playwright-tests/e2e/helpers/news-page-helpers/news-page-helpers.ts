import { Page } from "@playwright/test";
import { createSeo, getStrapiUrl, saveAndPublish } from "../global-helpers";
import axios from "axios";
import { SeoBlock } from "../types";

export async function createAndPublishNewsPage({
  page,
  newsTitle,
  seo,
}: {
  page: Page,
  newsTitle: string,
  seo: SeoBlock,
}) {
  await page.locator('a[aria-label="Content Manager"]')
    .click();

  await page.locator(`a`, { hasText: 'Страница новостей' })
    .click();

  await page.locator('[name="title"]')
    .fill(newsTitle);

  await createSeo({
    page,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    keywords: seo.keywords
  });

  await saveAndPublish({ page });
}

export async function deleteNewsPage() {
  try {
    await axios.delete(getStrapiUrl({ path: `/api/news-page` }));
  } catch { }
}