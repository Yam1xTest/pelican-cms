import { Page } from "@playwright/test";
import { createHeroBlock, createSeo, getStrapiUrl, saveAndPublish, uploadFile } from "../global-helpers";
import axios from "axios";

export async function createAndPublishHomepage({
  page,
  hero,
  services,
  seo,
  filePath,
}: {
  page: Page,
  hero: HeroBlock,
  services: {
    phone: string,
    email: string,
    cards: {
      title: string,
      cards: {
        title: string,
        description: string,
        link: string,
        labels: {
          text: string
        }[]
      }[]
    }
  },
  seo: {
    metaTitle: string,
    metaDescription: string
  },
  filePath: string
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
    filePath
  });

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
    filePath,
  });

  await createSeo({
    page,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription
  })

  await saveAndPublish({ page });
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
  phone: string,
  email: string,
  card: {
    title: string,
    description: string,
    link: string,
    labels: {
      text: string
    },
  }
  filePath: string
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

  await page.locator('id=blocks.1.cards.title')
    .fill(title);

  await page.getByText('No entry yet. Click on the button below to add one.')
    .first()
    .click();

  await page.locator('id=blocks.1.cards.cards.0.title')
    .fill(card.title);

  await page.locator('id=blocks.1.cards.cards.0.description')
    .fill(card.description);

  await uploadFile({
    page,
    filePath,
  });

  await page.locator('id=blocks.1.cards.cards.0.link')
    .fill(card.link);

  await page.locator('id=blocks.1.phone')
    .fill(phone);

  await page.locator('id=blocks.1.email')
    .fill(email);

  await page.getByText('No entry yet. Click on the button below to add one.')
    .first()
    .click();

  await page.locator('id=blocks.1.cards.cards.0.labels.0.text')
    .fill(card.labels.text);
}

export async function deleteHomepage() {
  try {
    await axios.delete(getStrapiUrl({ path: `/api/home` }));
  } catch { }
}