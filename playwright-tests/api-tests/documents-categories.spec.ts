import { MOCK_SEO } from "../mocks";
import { E2E_SMOKE_NAME_PREFIX } from "../helpers/global-helpers";
import { deleteDocumentCategoryByTitle, createDocumentsCategoryByTitle, getDocumentCategoryByTitle } from "../helpers/document-categories";
import { ApiTestFixtures, expect, test } from "../helpers/api-test-fixtures";

const DOCUMENT_CATEGORY_TITLE = `${E2E_SMOKE_NAME_PREFIX} Договора`;
const ENDPOINT = `/api/documents-categories`;

test.describe(`Documents categories response tests`, () => {
  test.beforeEach(async ({ apiRequest }) => {
    await deleteDocumentCategoryByTitle({
      title: DOCUMENT_CATEGORY_TITLE,
      apiRequest
    });

    await createDocumentsCategoryByTitle({
      title: DOCUMENT_CATEGORY_TITLE,
      apiRequest
    });
  });

  test.afterEach(async ({ apiRequest }) => {
    await deleteDocumentCategoryByTitle({
      title: DOCUMENT_CATEGORY_TITLE,
      apiRequest
    });
  });

  test(`
      GIVEN an empty documents categories collection
      WHEN call method POST ${ENDPOINT}
      AND call method GET ${ENDPOINT}
      SHOULD get a correct response
      `,
    checkDocumentsCategoriesResponseTest
  );
});

async function checkDocumentsCategoriesResponseTest({
  apiRequest
}: {
  apiRequest: ApiTestFixtures['apiRequest']
}) {
  const expectedDocumentsCategoriesResponse = {
    data: [
      {
        title: DOCUMENT_CATEGORY_TITLE,
        slug: 'e2e-smoke-dogovora',
        seo: MOCK_SEO
      }
    ]
  };

  const documentsCategoriesResponse = await apiRequest(`${ENDPOINT}?populate=*`);

  const documentsCategoriesData = await documentsCategoriesResponse.json();

  const documentCategoryTest = getDocumentCategoryByTitle({
    documentCategories: documentsCategoriesData,
    title: DOCUMENT_CATEGORY_TITLE
  })!;

  await expect({
    data: [
      {
        title: documentCategoryTest.title,
        slug: documentCategoryTest.slug,
        seo: {
          metaTitle: documentCategoryTest.seo.metaTitle,
          metaDescription: documentCategoryTest.seo.metaDescription,
          keywords: documentCategoryTest.seo.keywords,
        },
      }
    ]
  }, 'Documents categories response corrected')
    .toEqual(expectedDocumentsCategoriesResponse);
}
