import test, { expect } from "@playwright/test";
import axios from "axios";
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
    GIVEN empty news page
    WHEN fill out the news page
    SHOULD get a response news page
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
  })
    .toEqual(expectedNewsPageResponse);
}

async function updateNewsPage() {
  await axios.put(`${getStrapiUrl({ path: ENDPOINT })}`, {
    data: {
      title: NEWS_TITLE,
      seo: MOCK_SEO
    }
  });
}

async function deleteNewsPage() {
  await axios.delete(getStrapiUrl({
    path: ENDPOINT
  }));
}