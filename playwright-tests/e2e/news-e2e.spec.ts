import { expect, Page, test } from '@playwright/test';
import {
  authenticate,
  clickByCheckboxAndDeleteWithConfirm, enableApi,
  register,
  uploadImage
} from '../helpers';
import axios from 'axios';

test.describe(`News tests`, () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:1337/admin', {
      waitUntil: 'networkidle'
    })

    const isRegistrationPage = await page.getByRole(`textbox`, {
      name: `First name`,
    })
      .isVisible();


    await register({
      page,
    });


    await authenticate({
      page,
    });

    await enableApi({
      page,
    });
  });

  // test.afterEach(async ({
  //   page,
  // }) => {
  //   await deleteNews({
  //     page,
  //   });

  //   await deleteImages({
  //     page,
  //   });
  // });

  test(`
    GIVEN collection news without record
    WHEN create one news
    SHOULD get a response with this news
    `,
    newsResponseTest
  );
});

async function newsResponseTest({
  page,
}: {
  page: Page
}) {
  const title = `В зоопарке появился амурский тигр`;
  const description = `На фотографии изображен амурский тигр!`;
  const innerContent = `В зоопарке появился амурский тигр, приходите посмотреть!`;
  const expectedResponse = {
    data: [
      {
        title,
        description,
        innerContent: `<p>${innerContent}</p>`,
      }
    ]
  };

  await createNews({
    page,
    title,
    description,
    innerContent,
    imagePath: `./playwright-tests/e2e/fixtures/tiger.png`,
  });

  await page.waitForTimeout(500);

  const response = (await axios.get('http://localhost:1337/api/news?populate=*')).data;

  await expect({
    data: [
      {
        title: response.data[0].title,
        description: response.data[0].description,
        innerContent: response.data[0].innerContent,
      }
    ]
  })
    .toEqual(expectedResponse);

  await expect(response.data[0].image.url)
    .not
    .toBeNull()
}

async function createNews({
  page,
  title,
  description,
  innerContent,
  imagePath,
}: {
  page: Page,
  title: string,
  description: string,
  innerContent: string,
  imagePath: string
}) {
  await page.getByText(`Content Manager`)
    .click();

  await page.getByText(`Новости`)
    .click();

  await page.getByText(`Create new entry`)
    .first()
    .click();

  await page.getByRole(`textbox`, {
    name: `title`,
  })
    .fill(title);

  await page.locator(`#description`)
    .fill(description);

  await uploadImage({
    page,
    imagePath,
  });

  await page.locator(`.ck-content`)
    .fill(innerContent);

  await page.getByText(`Save`)
    .click();

  await page.getByText(`Publish`)
    .click();
}


async function deleteNews({
  page,
}: {
  page: Page
}) {
  await page.getByText('Back')
    .click()

  await clickByCheckboxAndDeleteWithConfirm({
    page,
  });
}
