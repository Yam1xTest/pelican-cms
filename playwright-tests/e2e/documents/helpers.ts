import axios from "axios";
import { E2E_SMOKE_NAME_PREFIX, getStrapiUrl } from "../../helpers";
import { Page } from "@playwright/test";

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

  await page.getByRole(`textbox`, {
    name: `title`,
  })
    .fill(title);

  await page.getByText(`Save`)
    .click();

  await page.getByText(`Publish`)
    .click();
}

export async function deleteDocumentsCategories() {
  const documentCategoriesResponse = (await axios.get(getStrapiUrl({ path: '/api/documents-categories?populate=*' }))).data;

  const documentCategoriesDelete = getDocumentCategoriesWithTestPrefix({ documentCategories: documentCategoriesResponse });

  documentCategoriesDelete.forEach(async ({ id }) => {
    await axios.delete(getStrapiUrl({ path: `/api/documents-categories/${id}` }));
  })
}

export function getDocumentCategoriesWithTestPrefix({
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