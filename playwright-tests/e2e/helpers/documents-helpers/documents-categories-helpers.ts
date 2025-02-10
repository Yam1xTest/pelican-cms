import { expect, Page } from '@playwright/test';
import {
  E2E_SMOKE_NAME_PREFIX,
  getStrapiUrl,
  saveAndPublish
} from '../global-helpers';
import axios from 'axios';

export async function documentsCategoriesResponseTest({
  page,
}: {
  page: Page
}) {
  const title = `${E2E_SMOKE_NAME_PREFIX} Отчёты`;
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

export async function createAndPublicDocumentsCategory({
  page,
  title,
}: {
  page: Page,
  title: string,
}) {
  await page.getByText(`Content Manager`)
    .click();

  await page.getByText(`Категории документов`)
    .click();

  await page.getByText(`Create new entry`)
    .first()
    .click();

  await page.locator(`id=title`)
    .fill(title);

  await saveAndPublish({ page });
}

export async function deleteDocumentsCategories() {
  const documentCategoriesResponse = (await axios.get(getStrapiUrl({ path: '/api/documents-categories?populate=*' }))).data;

  const documentCategoriesDelete = getDocumentCategoriesWithTestPrefix({ documentCategories: documentCategoriesResponse });

  documentCategoriesDelete.forEach(async ({ id }) => {
    await axios.delete(getStrapiUrl({ path: `/api/documents-categories/${id}` }));
  })
}

function getDocumentCategoriesWithTestPrefix({
  documentCategories
}: {
  documentCategories: {
    data: {
      id?: number;
      attributes?: {
        title: string;
      }
    }[]
  }
}) {
  return documentCategories.data.filter((documentCategories) => documentCategories?.attributes.title.startsWith(E2E_SMOKE_NAME_PREFIX));
}