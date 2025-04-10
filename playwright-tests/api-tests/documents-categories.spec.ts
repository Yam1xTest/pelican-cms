import axios from "axios";
import { MOCK_SEO } from "../mocks";
import { E2E_SMOKE_NAME_PREFIX, getStrapiUrl } from "../helpers/global-helpers";
import test, { expect } from "@playwright/test";
import { deleteDocumentCategoryByTitle, createDocumentsCategoryByTitle, getDocumentCategoryByTitle } from "../helpers/document-categories";

const DOCUMENT_CATEGORY_TITLE = `${E2E_SMOKE_NAME_PREFIX} Договора`;

test.describe(`Documents categories response tests`, () => {
  test.beforeEach(async () => {
    await deleteDocumentCategoryByTitle({
      title: DOCUMENT_CATEGORY_TITLE
    });

    await createDocumentsCategoryByTitle({
      title: DOCUMENT_CATEGORY_TITLE
    });
  });

  test.afterEach(async () => {
    await deleteDocumentCategoryByTitle({
      title: DOCUMENT_CATEGORY_TITLE
    });
  });

  test(`
      GIVEN collection of documents categories without record
      WHEN create one category
      SHOULD get a response with this category
      `,
    checkDocumentsCategoriesResponseTest
  );
});

async function checkDocumentsCategoriesResponseTest() {
  const expectedDocumentsCategoriesResponse = {
    data: [
      {
        title: DOCUMENT_CATEGORY_TITLE,
        slug: 'e2e-smoke-dogovora',
        seo: MOCK_SEO
      }
    ]
  };

  const documentsCategoriesResponse = (await axios.get(getStrapiUrl({ path: `/api/documents-categories?populate=*` }))).data;
  const documentCategoryTest = getDocumentCategoryByTitle({
    documentCategories: documentsCategoriesResponse,
    title: DOCUMENT_CATEGORY_TITLE
  });

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
  })
    .toEqual(expectedDocumentsCategoriesResponse);
}