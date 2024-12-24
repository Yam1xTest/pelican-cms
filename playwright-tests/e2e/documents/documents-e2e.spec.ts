import { expect, Page, test } from '@playwright/test';
import {
  authenticate,
  deleteFiles,
  E2E_SMOKE_NAME_PREFIX,
  getStrapiUrl,
  goto,
  uploadFile
} from '../../helpers';
import axios from 'axios';
import { createAndPublicDocumentsCategory, deleteDocumentsCategories } from './helpers';

test.describe(`Documents response tests`, () => {
  test.beforeEach(async ({
    page,
  }) => {
    await deleteDocumentsCategories();

    await deleteDocuments()

    await deleteFiles();

    await goto({ page })

    await authenticate({
      page,
    });
  });

  test.afterEach(async () => {
    await deleteDocumentsCategories();

    await deleteDocuments();

    await deleteFiles();
  });

  test(`
    GIVEN collection documents without record
    WHEN create one document
    SHOULD get a response with this document
    `,
    documentsResponseTest
  );
});

async function documentsResponseTest({
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

  await page.waitForTimeout(500);

  const documentsResponse = (await axios.get(getStrapiUrl({ path: '/api/documents?populate=*' }))).data;
  const documentsWithPrefix = getDocumentsWithTestPrefix({ documents: documentsResponse });

  await expect({
    data: [
      {
        attributes:
        {
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
    .toBeNull()
}

async function createAndPublicDocument({
  page,
  categoryTitle,
  title,
  subtitle,
  description,
  filePath,
}: {
  page: Page,
  categoryTitle: string,
  title: string,
  subtitle: string,
  description: string,
  filePath: string
}) {
  await page.getByText(`Content Manager`)
    .click();

  await page.getByText(`Документы`)
    .click();

  await page.getByText(`Create new entry`)
    .first()
    .click();

  await page.getByRole(`checkbox`, {
    name: `showDate`,
  })
    .click();

  await page.getByRole(`textbox`, {
    name: `title`,
  })
    .fill(title);

  await page.locator(`.ck-content`)
    .nth(0)
    .fill(subtitle);

  await page.locator(`.ck-content`)
    .nth(1)
    .fill(description);

  await uploadFile({
    page,
    filePath,
  });

  await page.getByRole(`combobox`, {
    name: `category`,
  })
    .fill(categoryTitle);

  await page.click('button:has-text("Save")');

  await page.click('button:has-text("Publish")');
}


async function deleteDocuments() {
  const documentsResponse = (await axios.get(getStrapiUrl({ path: '/api/documents?populate=*' }))).data;

  const documentsDelete = getDocumentsWithTestPrefix({ documents: documentsResponse });

  documentsDelete.forEach(async ({ id }) => {
    await axios.delete(getStrapiUrl({ path: `/api/documents/${id}` }));
  })
}

function getDocumentsWithTestPrefix({
  documents
}: {
  documents: {
    data: {
      id?: number;
      attributes?: {
        showDate: boolean,
        title: string;
        subtitle: string;
        description?: string;
        files: {
          data: {
            attributes: {
              url: string;
            }
          }
        }
      }
    }[]
  }
}) {
  return documents.data.filter((document) => document?.attributes.title.startsWith(E2E_SMOKE_NAME_PREFIX));
}
