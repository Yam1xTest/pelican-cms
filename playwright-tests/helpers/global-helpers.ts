import { Page } from "@playwright/test";
import { ApiTestFixtures } from './api-test-fixtures';
import axios from "axios";
import 'dotenv/config';
import { HeroBlock, ImageWithButtonGridBlock, SeoBlock, sharedTicketsBlock, TextAndMediaBlock } from "../types";

export const E2E_SMOKE_NAME_PREFIX = `[E2E-SMOKE]`;

export async function getFileIdByName({
  name = '[E2E-SMOKE]-tiger.png',
  apiRequest
}: {
  name?: string;
  apiRequest: ApiTestFixtures['apiRequest'];
}) {
  const filesResponse = await apiRequest('/api/upload/files');
  const filesData = await filesResponse.json();

  return filesData.find((file) => file.name === name).id;
}

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export async function gotoCMS({
  page
}: {
  page: Page
}) {
  await page.goto(getStrapiUrl({ path: '/admin' }), {
    waitUntil: 'networkidle'
  })
}

export async function gotoUI({
  page,
  path,
}: {
  page: Page
  path?: string
}) {
  await page.goto(`${process.env.FRONTEND_URL || 'http://localhost:3000'}${path}`, {
    waitUntil: 'networkidle'
  })
}

export function getStrapiUrl({
  path
}: {
  path: string
}) {
  return `${process.env.SERVER_URL || 'http://localhost:1337'}${path}`
}

export async function authenticate({
  page,
}: {
  page: Page,
}) {
  await page.getByRole(`textbox`)
    .first()
    .fill(`admin@init-strapi-admin.strapi.io`);

  await page.getByRole(`textbox`)
    .last()
    .fill(`admin`);

  await page.getByText(`Login`)
    .click();
}

export async function uploadFile({
  page,
  filePath,
}: {
  page: Page
  filePath: string,
}) {
  await page.getByText(`Click to add an asset or drag and drop one in this area`)
    .first()
    .click();

  await page.getByRole(`button`, {
    name: `Add more assets`,
  })
    .click();

  await page.locator('input[name="files"]')
    .setInputFiles(filePath);


  await page.getByText(`Upload 1 asset to the library`)
    .click();

  await page.getByRole(`button`, {
    name: `Finish`,
  })
    .click();
}

export async function deleteFiles() {
  const filesResponse = (await axios.get(getStrapiUrl({ path: '/api/upload/files' }))).data;

  const filesDelete = filesResponse.filter((file) => file.name?.startsWith(E2E_SMOKE_NAME_PREFIX));

  filesDelete.forEach(async ({ id }) => {
    await axios.delete(getStrapiUrl({ path: `/api/upload/files/${id}` }));
  })
}

export async function clickByCheckboxAndDeleteWithConfirm({
  page,
}: {
  page: Page
}) {
  await page.getByRole(`checkbox`)
    .first()
    .check();

  await page.getByRole(`button`, {
    name: `Delete`,
  })
    .first()
    .click();

  await page.getByRole(`button`, {
    name: `Confirm`,
  })
    .click();
}

export async function saveAndPublish({
  page
}: {
  page: Page
}) {
  const saveResponsePromise = page.waitForResponse((response) => {
    const responseType = (response.url().includes('/single-types/') ? 'PUT' : 'POST');

    return (
      response.url().includes('/content-manager/') &&
      response.request().method() === responseType
    )
  });

  await page.getByRole(`button`, {
    name: 'Save'
  })
    .click();

  await saveResponsePromise;

  const publishResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/content-manager/') &&
    response.request().method() === 'POST'
  );

  await page.getByRole(`button`, {
    name: 'Publish'
  })
    .click();

  await publishResponsePromise;
}

export async function createSeo({
  page,
  metaTitle,
  metaDescription,
  keywords,
}: {
  page: Page,
  metaTitle: SeoBlock['metaTitle'],
  metaDescription: SeoBlock['metaDescription'],
  keywords: SeoBlock['keywords']
}) {
  await page.getByText('No entry yet. Click to add one.')
    .last()
    .click();

  await page.locator('[name="seo.metaTitle"]')
    .fill(metaTitle);

  await page.locator('[name="seo.metaDescription"]')
    .fill(metaDescription);

  await page.locator('[name="seo.keywords"]')
    .fill(keywords);

  await page.waitForTimeout(500);
}

export async function createHeroBlock({
  page,
  id,
  title,
  infoCard,
  scheduleCard,
  filePath,
}: {
  page: Page,
  id: number
} & HeroBlock) {
  await page.getByRole('button', {
    name: 'Add a component to blocks'
  }).click();

  await page.getByRole('button', {
    name: 'Первый блок'
  }).click();

  await page.getByRole('button', {
    name: 'Первый блок'
  }).click();

  await page.locator(`[name="blocks.${id}.title"]`)
    .fill(title);

  await uploadFile({
    page,
    filePath,
  });

  await page.locator(`[name="blocks.${id}.infoCard.title"]`)
    .fill(infoCard.title);

  await page.locator(`[name="blocks.${id}.infoCard.description"]`)
    .fill(infoCard.description);

  await page.locator(`[name="blocks.${id}.scheduleCard.title"]`)
    .fill(scheduleCard.title);

  await page.getByText('No entry yet. Click to add one.')
    .first()
    .click();

  await page.locator(`[name="blocks.${id}.scheduleCard.timetable.0.days"]`)
    .fill(scheduleCard.timetable[0].days);

  await page.locator(`[name="blocks.${id}.scheduleCard.timetable.0.time"]`)
    .fill(scheduleCard.timetable[0].time);

  await page.locator(`[name="blocks.${id}.scheduleCard.timetable.0.ticketsOfficeTime"]`)
    .fill(scheduleCard.timetable[0].ticketsOfficeTime);
}

export async function createTextAndMediaBlock({
  page,
  id,
  title,
  description,
  filePath
}: {
  page: Page,
  id: number
} & TextAndMediaBlock) {
  await page.getByRole('button', {
    name: 'Add a component to blocks'
  }).click();

  await page.getByRole('button', {
    name: 'Блок с картинкой/видео'
  }).click();

  await page.getByRole('button', {
    name: 'Блок с картинкой/видео'
  }).click();

  await page.locator(`[name="blocks.${id}.title"]`)
    .fill(title);

  await page.locator(`[name="blocks.${id}.description"]`)
    .fill(description);

  await uploadFile({
    page,
    filePath,
  });
}

export async function createImageWithButtonGridBlock({
  page,
  id,
  title,
  description,
  link,
  label,
  largeImagePath,
  smallImagePath,
}: {
  page: Page,
  id: number
} & ImageWithButtonGridBlock) {
  await page.getByRole('button', {
    name: 'Add a component to blocks'
  }).click();

  await page.getByRole('button', {
    name: 'Блок с картинкой и кнопкой'
  }).click();

  await page.getByRole('button', {
    name: 'Блок с картинкой и кнопкой'
  }).click();

  await page.locator(`[name="blocks.${id}.title"]`)
    .fill(title);

  await page.locator(`[name="blocks.${id}.description"]`)
    .fill(description);

  await page.locator(`[name="blocks.${id}.button.link"]`)
    .fill(link);

  await page.locator(`[name="blocks.${id}.button.label"]`)
    .fill(label);

  await uploadFile({
    page,
    filePath: largeImagePath,
  });

  await uploadFile({
    page,
    filePath: smallImagePath,
  });
}

export async function createTicketsBlock({
  page,
  id,
  title,
  description,
  tickets,
  link,
  note,
}: {
  page: Page,
  id: number
} & sharedTicketsBlock) {
  await page.getByRole('button', {
    name: 'Add a component to blocks'
  }).click();

  await page.getByRole('button', {
    name: 'Блок с билетами'
  }).click();

  await page.getByRole('button', {
    name: 'Блок с билетами'
  }).click();

  await page.locator(`[name="blocks.${id}.title"]`)
    .fill(title);

  await page.locator(`[name="blocks.${id}.description"]`)
    .fill(description);

  await page.getByText('No entry yet. Click to add one.')
    .first()
    .click();

  await page.locator(`[name="blocks.${id}.subsidizedTickets.0.category"]`)
    .fill(tickets[0].category);

  await page.locator(`[name="blocks.${id}.subsidizedTickets.0.description"]`)
    .fill(tickets[0].description);

  await page.locator(`[name="blocks.${id}.subsidizedTickets.0.price"]`)
    .fill(tickets[0].price);

  // await page.locator(`[name="blocks.${id}.subsidizedTickets.0.frequency"]`)
  //   .fill(tickets[0].frequency);

  await page.locator(`[name="blocks.${id}.note"]`)
    .fill(note);

  await page.locator(`[name="blocks.${id}.link"]`)
    .fill(link);
}