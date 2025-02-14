import { Page } from "@playwright/test";
import { createHeroBlock, createSeo, getStrapiUrl, saveAndPublish, uploadFile } from "../global-helpers";
import axios from "axios";

export async function createAndPublishHomepage({
  page,
  hero,
  services,
  textAndMedia,
  seo,
}: {
  page: Page,
  hero: HeroBlock,
  services: ServicesBlock,
  textAndMedia: TextAndMediaBlock,
  seo: SeoBlock
}) {
  await page.getByText(`Content Manager`)
    .click();

  await page.getByText(`Главная страница`)
    .click();

  await createHeroBlock({
    page,
    title: hero.title,
    infoCard: hero.infoCard,
    scheduleCard: hero.scheduleCard,
    filePath: hero.filePath
  });

  await createTextAndMediaBlock({
    page,
    title: textAndMedia.title,
    description: textAndMedia.description,
    filePath: textAndMedia.filePath
  })

  await createServicesBlock({
    page,
    phone: services.phone,
    email: services.email,
    title: services.cards.title,
    card: {
      title: services.cards.cards[0].title,
      description: services.cards.cards[0].description,
      link: services.cards.cards[0].link,
      labels: services.cards.cards[0].labels[0],
    },
    filePath: services.filePath,
  });

  await createSeo({
    page,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription
  })

  await saveAndPublish({ page });
}

async function createTextAndMediaBlock({
  page,
  title,
  description,
  filePath
}: {
  page: Page,
  title: TextAndMediaBlock['title'],
  description: TextAndMediaBlock['description'],
  filePath: TextAndMediaBlock['filePath']
}) {
  await page.getByRole('button', {
    name: 'Add a component to blocks'
  }).click();

  await page.getByRole('button', {
    name: 'TextAndMedia'
  }).click();

  await page.locator('id=blocks.1.title')
    .fill(title);

  await page.locator('id=blocks.1.description')
    .fill(description);

  await uploadFile({
    page,
    filePath,
  });
}

async function createServicesBlock({
  page,
  title,
  card,
  email,
  phone,
  filePath
}: {
  page: Page,
  title: string,
  phone: ServicesBlock['phone'],
  email: ServicesBlock['email'],
  card: {
    title: string,
    description: string,
    link: string,
    labels: {
      text: string
    },
  }
  filePath: ServicesBlock['filePath']
}) {
  await page.getByRole('button', {
    name: 'Add a component to blocks'
  }).click();

  await page.getByRole('button', {
    name: 'home'
  }).click();

  await page.getByRole('button', {
    name: 'Services'
  }).click();

  await page.locator('id=blocks.2.cards.title')
    .fill(title);

  await page.getByText('No entry yet. Click on the button below to add one.')
    .first()
    .click();

  await page.locator('id=blocks.2.cards.cards.0.title')
    .fill(card.title);

  await page.locator('id=blocks.2.cards.cards.0.description')
    .fill(card.description);

  await uploadFile({
    page,
    filePath,
  });

  await page.locator('id=blocks.2.cards.cards.0.link')
    .fill(card.link);

  await page.locator('id=blocks.2.phone')
    .fill(phone);

  await page.locator('id=blocks.2.email')
    .fill(email);

  await page.getByText('No entry yet. Click on the button below to add one.')
    .first()
    .click();

  await page.locator('id=blocks.2.cards.cards.0.labels.0.text')
    .fill(card.labels.text);
}

export async function deleteHomepage() {
  try {
    await axios.delete(getStrapiUrl({ path: `/api/home` }));
  } catch { }
}