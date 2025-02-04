import test, { expect, Page } from "@playwright/test";
import { authenticate, deleteFiles, E2E_SMOKE_NAME_PREFIX, getStrapiUrl, gotoCMS } from "./helpers/global-helpers";
import { createAndPublicDocumentsCategory, deleteDocumentsCategories, getDocumentCategoriesWithTestPrefix } from "./helpers/documents-helpers/documents-categories-helpers";
import { createAndPublicDocument, deleteDocuments, getDocumentsWithTestPrefix } from "./helpers/documents-helpers/documents-helpers";
import { createAndPublicNews, deleteNews, getNewsWithTestPrefix } from "./helpers/news-helpers/news-helpers";
import axios from "axios";


test.describe(`API response tests`, () => {
  let page: Page;

  test.beforeAll(async ({
    browser,
  }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await gotoCMS({ page });

    await authenticate({
      page,
    });
  });


  test.describe(`News response tests`, () => {
    test.beforeEach(async () => {
      await deleteNews();

      await deleteFiles();
    });

    test.afterEach(async () => {
      await deleteNews();

      await deleteFiles();
    });

    test(`
      GIVEN collection of news without record
      WHEN create one news
      SHOULD get a response with this news
      `,
      async () => await checkNewsResponseTest({ page })
    );
  });

  test.describe(`Documents categories response tests`, () => {
    test.beforeEach(async () => {
      await deleteDocumentsCategories();

      await deleteFiles();
    });

    test.afterEach(async () => {
      await deleteDocumentsCategories();

      await deleteFiles();
    });

    test(`
      GIVEN collection of documents categories without record
      WHEN create one category
      SHOULD get a response with this category
      `,
      async () => await checkDocumentsCategoriesResponseTest({ page })
    );
  });

  test.describe(`Documents response tests`, () => {
    test.beforeEach(async () => {
      await deleteDocumentsCategories();

      await deleteDocuments();

      await deleteFiles();;
    });

    test.afterEach(async () => {
      await deleteDocumentsCategories();

      await deleteDocuments();

      await deleteFiles();
    });

    test(`
      GIVEN collection of documents without record
      WHEN create one document
      SHOULD get a response with this document
      `,
      async () => await checkDocumentsResponseTest({ page })
    );
  });
})


async function checkNewsResponseTest({
  page,
}: {
  page: Page
}) {
  const title = `${E2E_SMOKE_NAME_PREFIX} В зоопарке появился амурский тигр`;
  const description = `На фотографии изображен амурский тигр!`;
  const innerContent = `В зоопарке появился амурский тигр, приходите посмотреть!`;
  const expectedNewsResponse = {
    data: [
      {
        attributes: {
          title,
          description,
          innerContent: `<p>${innerContent}</p>`,
        }
      }
    ]
  };

  await createAndPublicNews({
    page,
    title,
    description,
    innerContent,
    filePath: `./playwright-tests/e2e/fixtures/[E2E-SMOKE]-tiger.png`,
  });


  const newsResponse = (await axios.get(getStrapiUrl({ path: '/api/news?populate=*' }))).data;
  const newsWithPrefix = getNewsWithTestPrefix({ news: newsResponse });

  await expect({
    data: [
      {
        attributes:
        {
          title: newsWithPrefix[0].attributes.title,
          description: newsWithPrefix[0].attributes.description,
          innerContent: newsWithPrefix[0].attributes.innerContent,
        }
      }
    ]
  })
    .toEqual(expectedNewsResponse);

  await expect(newsWithPrefix[0].attributes.image.data.attributes.url)
    .not
    .toBeNull();
}

async function checkDocumentsResponseTest({
  page,
}: {
  page: Page
}) {
  const categoryTitle = `${E2E_SMOKE_NAME_PREFIX} Отчёты`;
  const showDate = false;
  const title = `${E2E_SMOKE_NAME_PREFIX} Договор №350474`;
  const subtitle = `Договор на поставку продукции животноводства (мясо говядина) для нужд муниципального бюджетного учреждения культуры «зоопарк»`;
  const description = `Контракт заключен по результатам электронного аукциона в рамках 223-ФЗ. Извещение №31907985126 в электронной форме размещены на сайте по адресу в сети Интернет: www.zakupki.gov.ru и на электронной площадке tender.otc.ru процедура №4442641 лот №7816638. Протокол №U4442641-7816638-3 от 07.07.2019 г.`;
  const expectedDocumentsResponse = {
    data: [
      {
        attributes: {
          showDate,
          title,
          subtitle: `<p>${subtitle}</p>`,
          description: `<p>${description}</p>`,
        }
      }
    ]
  };

  await createAndPublicDocumentsCategory({
    page,
    title: categoryTitle,
  });

  await createAndPublicDocument({
    page,
    categoryTitle,
    title,
    subtitle,
    description,
    filePath: `./playwright-tests/e2e/fixtures/[E2E-SMOKE]-new-document.pdf`,
  });

  const documentsResponse = (await axios.get(getStrapiUrl({ path: '/api/documents?populate=*' }))).data;
  const documentsWithPrefix = getDocumentsWithTestPrefix({ documents: documentsResponse });

  await expect({
    data: [
      {
        attributes: {
          showDate: documentsWithPrefix[0].attributes.showDate,
          title: documentsWithPrefix[0].attributes.title,
          subtitle: documentsWithPrefix[0].attributes.subtitle,
          description: documentsWithPrefix[0].attributes.description,
        }
      }
    ]
  })
    .toEqual(expectedDocumentsResponse);

  await expect(documentsWithPrefix[0].attributes.files.data[0].attributes.url)
    .not
    .toBeNull();
}

async function checkDocumentsCategoriesResponseTest({
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