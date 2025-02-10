import { expect, Page } from '@playwright/test';
import axios from 'axios';
import { E2E_SMOKE_NAME_PREFIX, getStrapiUrl, saveAndPublish, uploadFile } from '../global-helpers';

export async function newsResponseTest({
  page,
}: {
  page: Page
}) {
  const title = `${E2E_SMOKE_NAME_PREFIX} В зоопарке появился амурский тигр`;
  const description = `На фотографии изображен амурский тигр!`;
  const innerContent = `В зоопарке появился амурский тигр, приходите посмотреть!`;
  const expectedNewsResponse = {
    data: [
      {
        attributes: {
          title,
          description,
          innerContent: `<p>${innerContent}</p>`,
        }
      }
    ]
  };

  await createAndPublicNews({
    page,
    title,
    description,
    innerContent,
    filePath: `./playwright-tests/e2e/fixtures/[E2E-SMOKE]-tiger.png`,
  });

  await page.waitForTimeout(500);

  const newsResponse = (await axios.get(getStrapiUrl({ path: '/api/news?populate=*' }))).data;
  const newsWithPrefix = getNewsWithTestPrefix({ news: newsResponse });

  await expect({
    data: [
      {
        attributes:
        {
          title: newsWithPrefix[0].attributes.title,
          description: newsWithPrefix[0].attributes.description,
          innerContent: newsWithPrefix[0].attributes.innerContent,
        }
      }
    ]
  })
    .toEqual(expectedNewsResponse);

  await expect(newsWithPrefix[0].attributes.image.data.attributes.url)
    .not
    .toBeNull();
}

export async function deleteNews() {
  const newsResponse = (await axios.get(getStrapiUrl({ path: '/api/news?populate=*' }))).data;

  const newsDelete = getNewsWithTestPrefix({ news: newsResponse });

  newsDelete.forEach(async ({ id }) => {
    await axios.delete(getStrapiUrl({ path: `/api/news/${id}` }));
  })
}

async function createAndPublicNews({
  page,
  title,
  description,
  innerContent,
  filePath,
}: {
  page: Page,
  title: string,
  description: string,
  innerContent: string,
  filePath: string
}) {
  await page.getByText(`Content Manager`)
    .click();

  await page.getByText(`Новости`)
    .click();

  await page.getByText(`Create new entry`)
    .first()
    .click();

  await page.locator(`id=title`)
    .fill(title);

  await page.locator(`#description`)
    .fill(description);

  await uploadFile({
    page,
    filePath,
  });

  await page.locator(`.ck-content`)
    .fill(innerContent);

  await saveAndPublish({ page });
}

function getNewsWithTestPrefix({
  news
}: {
  news: NewsResponse
}) {
  return news.data.filter((news) => news?.attributes.title.startsWith(E2E_SMOKE_NAME_PREFIX));
}

type NewsResponse = {
  data: {
    id?: number;
    attributes?: {
      title: string;
      description?: string;
      innerContent: string;
      image: {
        data: {
          attributes: {
            url: string;
            alternativeText: string;
          }
        }
      }
    }
  }[]
}