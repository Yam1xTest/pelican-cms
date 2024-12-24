import { expect, Page, test } from '@playwright/test';
import {
  authenticate,
  deleteFiles,
  E2E_SMOKE_NAME_PREFIX,
  getStrapiUrl,
  goto
} from '../../helpers';
import axios from 'axios';
import { createAndPublicDocumentsCategory, deleteDocumentsCategories, getDocumentCategoriesWithTestPrefix } from './helpers';

test.describe(`Documents categories response tests`, () => {
  test.beforeEach(async ({
    page,
  }) => {
    await deleteDocumentsCategories()

    await deleteFiles();

    await goto({ page })

    await authenticate({
      page,
    });
  });

  test.afterEach(async () => {
    await deleteDocumentsCategories();

    await deleteFiles();
  });

  test(`
    GIVEN collection documents categories without record
    WHEN create one category
    SHOULD get a response with this category
    `,
    documentsCategoriesResponseTest
  );
});

async function documentsCategoriesResponseTest({
  page,
}: {
  page: Page
}) {
  const title = `${E2E_SMOKE_NAME_PREFIX} Тестовая категория`;
  const expectedDocumentsCategoriesResponse = {
    data: [
      {
        attributes: {
          title,
        }
      }
    ]
  };

  await createAndPublicDocumentsCategory({
    page,
    title,
  });

  await page.waitForTimeout(500);

  const documentsCategoriesResponse = (await axios.get(getStrapiUrl({ path: '/api/documents-categories?populate=*' }))).data;
  const documentCategoriesWithPrefix = getDocumentCategoriesWithTestPrefix({ documentCategories: documentsCategoriesResponse });

  await expect({
    data: [
      {
        attributes:
        {
          title: documentCategoriesWithPrefix[0].attributes.title,
        }
      }
    ]
  })
    .toEqual(expectedDocumentsCategoriesResponse);
}