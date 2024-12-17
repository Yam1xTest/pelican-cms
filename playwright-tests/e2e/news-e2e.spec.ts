import { expect, Page, test } from '@playwright/test';
import {
  authenticate, deleteImages, E2E_SMOKE_NAME_PREFIX, getStrapiUrl, goto, uploadImage
} from '../helpers';
import axios from 'axios';

test.describe(`News response tests`, () => {
  test.beforeEach(async ({
    page,
  }) => {
    await deleteNews()

    await deleteImages();

    await goto({ page })

    await authenticate({
      page,
    });
  });

  test.afterEach(async () => {
    await deleteNews();

    await deleteImages();
  });

  test(`
    GIVEN collection news without record
    WHEN create one news
    SHOULD get a response with this news
    `,
    newsResponseTest
  );
});

async function newsResponseTest({
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
    imagePath: `./playwright-tests/e2e/fixtures/[E2E-SMOKE]-tiger.png`,
  });

  await page.waitForTimeout(500);

  const newsResponse = (await axios.get(getStrapiUrl({ path: '/api/news?populate=*' }))).data;

  await expect({
    data: [
      {
        attributes:
        {
          title: newsResponse.data[0].attributes.title,
          description: newsResponse.data[0].attributes.description,
          innerContent: newsResponse.data[0].attributes.innerContent,
        }
      }
    ]
  })
    .toEqual(expectedNewsResponse);

  await expect(newsResponse.data[0].attributes.image.data.attributes.url)
    .not
    .toBeNull()
}

async function createAndPublicNews({
  page,
  title,
  description,
  innerContent,
  imagePath,
}: {
  page: Page,
  title: string,
  description: string,
  innerContent: string,
  imagePath: string
}) {
  await page.getByText(`Content Manager`)
    .click();

  await page.getByText(`Новости`)
    .click();

  await page.getByText(`Create new entry`)
    .first()
    .click();

  await page.getByRole(`textbox`, {
    name: `title`,
  })
    .fill(title);

  await page.locator(`#description`)
    .fill(description);

  await uploadImage({
    page,
    imagePath,
  });

  await page.locator(`.ck-content`)
    .fill(innerContent);

  await page.getByText(`Save`)
    .click();

  await page.getByText(`Publish`)
    .click();
}


async function deleteNews() {
  const newsResponse = (await axios.get(getStrapiUrl({ path: '/api/news?populate=*' }))).data;

  const newsDelete = newsResponse.data.filter((news) => news.attributes.title.startsWith(E2E_SMOKE_NAME_PREFIX));

  newsDelete.forEach(async ({ id }) => {
    await axios.delete(getStrapiUrl({ path: `/api/news/${id}` }));
  })
}
