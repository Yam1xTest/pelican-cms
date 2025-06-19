import { MOCK_SEO } from "../mocks";
import { API_SMOKE_NAME_PREFIX, getFileIdByName, HttpStatusCode } from "../helpers/global-helpers";
import { ApiTestFixtures, expect, test } from "../helpers/api-test-fixtures";
import { deleteNewsByTitle, getNewsByTitle, NEWS_ENDPOINT } from "../helpers/news-helper";

const NEWS_TITLE = `${API_SMOKE_NAME_PREFIX} В зоопарке появился амурский тигр`;
const DESCRIPTION = `На фотографии изображен амурский тигр!`;
const INNER_CONTENT = `В зоопарке появился амурский тигр, приходите посмотреть!`;
const DATE = '2025-02-15'

test.describe(`News response tests`, () => {
  test.beforeEach(async ({ apiRequest }) => {
    await deleteNewsByTitle({
      title: NEWS_TITLE,
      apiRequest
    });

    await createNews({ apiRequest });
  });

  test.afterEach(async ({ apiRequest }) => {
    await deleteNewsByTitle({
      title: NEWS_TITLE,
      apiRequest
    });
  });

  test(`
      GIVEN an empty news collection
      WHEN call method POST ${NEWS_ENDPOINT}
      AND call method GET ${NEWS_ENDPOINT}
      SHOULD get a correct response
      `,
    checkNewsResponseTest
  );
})

async function checkNewsResponseTest({
  apiRequest
}: {
  apiRequest: ApiTestFixtures['apiRequest'];
}) {
  const expectedNewsResponse = {
    data: [
      {
        title: NEWS_TITLE,
        description: DESCRIPTION,
        innerContent: INNER_CONTENT,
        slug: '2025/02/15/api-smoke-v-zooparke-poyavilsya-amurskij-tigr',
        date: DATE,
        seo: MOCK_SEO
      }
    ]
  };

  const newsResponse = await apiRequest(`${NEWS_ENDPOINT}?populate=*`);
  const newsData = await newsResponse.json();

  const newsTest = getNewsByTitle({
    news: newsData,
    title: NEWS_TITLE
  })!;

  await expect({
    data: [
      {
        title: newsTest.title,
        description: newsTest.description,
        innerContent: newsTest.innerContent,
        date: newsTest.date,
        slug: newsTest.slug,
        seo: {
          metaTitle: newsTest.seo.metaTitle,
          metaDescription: newsTest.seo.metaDescription,
          keywords: newsTest.seo.keywords
        }
      }
    ]
  }, 'News response corrected')
    .toEqual(expectedNewsResponse);

  await expect(newsTest.image.url)
    .not
    .toBeNull();
}

async function createNews({
  apiRequest
}: {
  apiRequest: ApiTestFixtures['apiRequest'];
}) {
  try {
    const response = await apiRequest(NEWS_ENDPOINT, {
      method: 'POST',
      data: {
        data: {
          title: NEWS_TITLE,
          description: DESCRIPTION,
          image: await getFileIdByName({
            apiRequest
          }),
          innerContent: INNER_CONTENT,
          date: DATE,
          seo: MOCK_SEO
        }
      }
    });

    await expect(response.status(), 'News should be created with status 201')
      .toEqual(HttpStatusCode.Created);
  } catch (error) {
    throw new Error(`Failed to create test news: ${error.message}`)
  }
}