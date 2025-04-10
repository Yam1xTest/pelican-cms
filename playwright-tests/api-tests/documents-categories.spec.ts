import test, { expect } from "@playwright/test";
import axios from "axios";
import { MOCK_SEO } from "../mocks";
import { SeoBlock } from "../types";
import { E2E_SMOKE_NAME_PREFIX, getStrapiUrl } from "../global-helpers";

const DOCUMENT_CATEGORY_TITLE = `${E2E_SMOKE_NAME_PREFIX} Договора`;
const ENDPOINT = `/api/documents-categories`

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

  const documentsCategoriesResponse = (await axios.get(getStrapiUrl({ path: `${ENDPOINT}?populate=*` }))).data;
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


export async function createDocumentsCategoryByTitle({
  title
}: {
  title: string;
}) {
  return await axios.post(`${getStrapiUrl({ path: ENDPOINT })}`, {
    data: {
      title,
      seo: MOCK_SEO
    }
  });
}

export async function deleteDocumentCategoryByTitle({
  title
}: {
  title: string;
}) {
  const documentCategoriesResponse = (await axios.get(getStrapiUrl({ path: `${ENDPOINT}?populate=*` }))).data;

  const documentCategory = getDocumentCategoryByTitle({
    documentCategories: documentCategoriesResponse,
    title
  });

  if (documentCategory) {
    await axios.delete(getStrapiUrl({
      path: `${ENDPOINT}/${documentCategory.documentId}`
    }));
  }
}

export function getDocumentCategoryByTitle({
  documentCategories,
  title
}: {
  documentCategories: {
    data: {
      id?: number;
      documentId: string;
      title: string;
      slug: string;
      seo: SeoBlock;
    }[]
  };
  title: string;
}) {
  return documentCategories.data.find((documentCategories) => documentCategories.title === title);
}