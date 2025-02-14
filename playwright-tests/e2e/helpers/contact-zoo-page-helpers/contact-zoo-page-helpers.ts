import { Page } from "@playwright/test";
import { createHeroBlock, createSeo, getStrapiUrl, saveAndPublish } from "../global-helpers";
import axios from "axios";

export async function createAndPublishContactZooPage({
  page,
  hero,
  seo,
}: {
  page: Page,
  hero: HeroBlock,
  seo: SeoBlock,
}) {
  await page.getByText(`Content Manager`)
    .click();

  await page.getByText(`Страница контактного зоопарка`)
    .click();

  await createHeroBlock({
    page,
    title: hero.title,
    infoCard: hero.infoCard,
    scheduleCard: hero.scheduleCard,
    filePath: hero.filePath
  });

  await createSeo({
    page,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription
  })

  await saveAndPublish({ page });
}

export async function deleteContactZooPage() {
  try {
    await axios.delete(getStrapiUrl({ path: `/api/contact-zoo` }));
  } catch { }
}