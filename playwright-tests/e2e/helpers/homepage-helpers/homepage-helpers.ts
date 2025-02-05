import { Page } from "@playwright/test";
import { getStrapiUrl, saveAndPublish, uploadFile } from "../global-helpers";
import axios from "axios";

export async function createAndPublishHomepage({
  page,
  title,
  infoCard,
  sheduleCard,
  filePath,
}: {
  page: Page,
  title: string,
  infoCard: {
    title: string,
    description: string
  },
  sheduleCard: {
    title: string,
    timetable: {
      days: string,
      time: string,
      ticketsOfficeTime: string
    }[]
  }
  filePath: string
}) {
  await page.getByText(`Content Manager`)
    .click();

  await page.getByText(`Главная страница`)
    .click();

  await page.getByRole('button', {
    name: 'Add a component to blocks'
  }).click();

  await page.getByRole('button', {
    name: 'Hero'
  }).click();

  await page.locator('id=blocks.0.title')
    .fill(title);

  await uploadFile({
    page,
    filePath,
  });

  await page.locator('id=blocks.0.infoCard.title')
    .fill(infoCard.title);

  await page.locator('id=blocks.0.infoCard.description')
    .fill(infoCard.description);

  await page.getByText('No entry yet. Click on the button below to add one.')
    .first()
    .click();

  await page.locator('id=blocks.0.sheduleCard.title')
    .fill(sheduleCard.title);

  await page.locator('id=blocks.0.sheduleCard.timetable.0.days')
    .fill(sheduleCard.timetable[0].days);

  await page.locator('id=blocks.0.sheduleCard.timetable.0.time')
    .fill(sheduleCard.timetable[0].time);

  await page.locator('id=blocks.0.sheduleCard.timetable.0.ticketsOfficeTime')
    .fill(sheduleCard.timetable[0].ticketsOfficeTime);

  await saveAndPublish({ page });
}

export async function deleteHomepage() {
  await axios.delete(getStrapiUrl({ path: `/api/home` }));
}