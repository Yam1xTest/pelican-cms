import test, { Page } from "@playwright/test";
import { authenticate, deleteFiles, goto } from "./helpers/global-helpers";
import { deleteDocumentsCategories, documentsCategoriesResponseTest } from "./helpers/documents-helpers/documents-categories-helpers";
import { deleteDocuments, documentsResponseTest } from "./helpers/documents-helpers/documents-helpers";
import { deleteNews, newsResponseTest } from "./helpers/news-helpers/news-helpers";


test.describe(`Response tests`, () => {
  let page: Page;

  test.beforeAll(async ({
    browser,
  }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await goto({ page });

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
      async () => await newsResponseTest({ page })
    );
  });

  // test.describe(`Documents categories response tests`, () => {
  //   test.beforeEach(async () => {
  //     await deleteDocumentsCategories();

  //     await deleteFiles();
  //   });

  //   test.afterEach(async () => {
  //     await deleteDocumentsCategories();

  //     await deleteFiles();
  //   });

  //   test(`
  //     GIVEN collection of documents categories without record
  //     WHEN create one category
  //     SHOULD get a response with this category
  //     `,
  //     async () => await documentsCategoriesResponseTest({ page })
  //   );
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
    async () => await documentsResponseTest({ page })
  );
});
})