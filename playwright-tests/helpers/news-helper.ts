import { expect } from "@playwright/test";
import { SeoBlock } from "../types";
import { ApiTestFixtures } from "./api-test-fixtures";
import { HttpStatusCode } from "./global-helpers";

export const NEWS_ENDPOINT = '/api/news';

export async function deleteNewsByTitle({
  title,
  apiRequest
}: {
  title: string;
  apiRequest: ApiTestFixtures['apiRequest'];
}) {
  try {
    const newsResponse = await apiRequest(`${NEWS_ENDPOINT}?populate=*`);
    const newsData = await newsResponse.json();

    const news = getNewsByTitle({
      news: newsData,
      title
    });

    if (news) {
      const response = await apiRequest(`${NEWS_ENDPOINT}/${news.documentId}`, {
        method: 'DELETE'
      });

      await expect(response.status(), 'News should be deleted with status 204')
        .toEqual(HttpStatusCode.NoContent);
    }
  } catch (error) {
    throw new Error(`Failed to delete test news: ${error.message}`)
  }
}

export function getNewsByTitle({
  news,
  title,
}: {
  news: NewsResponse;
  title: string;
}) {
  return news.data.find((news) => news.title === title);
}

type NewsResponse = {
  data: {
    id?: number;
    documentId: string;
    title: string;
    description?: string;
    innerContent: string;
    date: string;
    image: {
      url: string;
      alternativeText: string;
    },
    slug: string;
    seo: SeoBlock;
  }[]
}