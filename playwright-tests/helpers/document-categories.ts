import axios from "axios";
import { getStrapiUrl } from "./global-helpers";
import { MOCK_SEO } from "../mocks";
import { SeoBlock } from "../types";

const ENDPOINT = `/api/documents-categories`;

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