import axios, { AxiosError, HttpStatusCode } from "axios";
import { getStrapiUrl } from "./global-helpers";
import { MOCK_SEO } from "../mocks";
import { SeoBlock } from "../types";
import { expect } from "@playwright/test";

const ENDPOINT = `/api/documents-categories`;

export async function createDocumentsCategoryByTitle({
  title
}: {
  title: string;
}) {
  try {
    const response = await axios.post(`${getStrapiUrl({ path: ENDPOINT })}`, {
      data: {
        title,
        seo: MOCK_SEO
      }
    });

    await expect(response.status, 'Documents categories should be created with status 201')
      .toEqual(HttpStatusCode.Created);

    return response
  } catch (error) {
    throw new Error(`Failed to create test documents categories: ${(error as AxiosError).message}`)
  }
}

export async function deleteDocumentCategoryByTitle({
  title
}: {
  title: string;
}) {
  try {
    const documentCategoriesResponse = (await axios.get(getStrapiUrl({ path: `${ENDPOINT}?populate=*` }))).data;

    const documentCategory = getDocumentCategoryByTitle({
      documentCategories: documentCategoriesResponse,
      title
    });

    if (documentCategory) {
      const response = await axios.delete(getStrapiUrl({
        path: `${ENDPOINT}/${documentCategory.documentId}`
      }));

      await expect(response.status, 'Documents categories should be deleted with status 204')
        .toEqual(HttpStatusCode.NoContent);
    }
  } catch (error) {
    throw new Error(`Failed to delete test documents categories: ${(error as AxiosError).message}`)
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