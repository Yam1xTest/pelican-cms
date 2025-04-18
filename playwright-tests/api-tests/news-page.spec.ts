import test, { expect } from "@playwright/test";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { MOCK_SEO } from "../mocks";
import qs from "qs";
import { getStrapiUrl } from "../helpers/global-helpers";

const NEWS_TITLE = 'Новости';
const ENDPOINT = `/api/news-page`;

test.describe(`News page response tests`, () => {
  test.beforeEach(async () => {
    await updateNewsPage();
  });

  test.afterEach(async () => {
    await deleteNewsPage();
  });

  test(`
    GIVEN an empty news page
    WHEN call method PUT ${ENDPOINT}
    AND call method GET ${ENDPOINT}
    SHOULD get a correct response
    `,
    checkNewsPageResponseTest
  );
});

async function checkNewsPageResponseTest() {
  const expectedNewsPageResponse = {
    data: {
      title: NEWS_TITLE,
      seo: MOCK_SEO
    }
  };

  const queryParams = {
    populate: [
      `seo`,
    ],
  };

  const newsPageResponse = (await axios.get(getStrapiUrl({
    path: `${ENDPOINT}?${qs.stringify(queryParams)}`
  }))).data;

  await expect({
    data: {
      title: newsPageResponse.data.title,
      seo: {
        metaTitle: newsPageResponse.data.seo.metaTitle,
        metaDescription: newsPageResponse.data.seo.metaDescription,
        keywords: newsPageResponse.data.seo.keywords
      }
    }
  }, 'News page response corrected')
    .toEqual(expectedNewsPageResponse);
}

async function updateNewsPage() {
  try {
    const response = await axios.put(`${getStrapiUrl({ path: ENDPOINT })}`, {
      data: {
        title: NEWS_TITLE,
        seo: MOCK_SEO,
      },
    });

    await expect(response.status, 'News page should be updated with status 200')
      .toEqual(HttpStatusCode.Ok);
  } catch (error) {
    throw new Error(`Failed to update test news page: ${(error as AxiosError).message}`)
  }
}

async function deleteNewsPage() {
  try {
    const response = await axios.delete(getStrapiUrl({
      path: ENDPOINT
    }));

    await expect(response.status, 'News page should be deleted with status 204')
      .toEqual(HttpStatusCode.NoContent);
  } catch (error) {
    throw new Error(`Failed to delete test news page: ${(error as AxiosError).message}`)
  }
}
