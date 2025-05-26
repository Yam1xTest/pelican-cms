import { expect } from "@playwright/test";
import qs from "qs";
import {
  MOCK_HERO,
  MOCK_TEXT_AND_MEDIA,
  MOCK_IMAGE_WITH_BUTTON_GRID,
  MOCK_HOME_SERVICES,
  MOCK_TICKETS,
  MOCK_SEO
} from "../mocks";
import { getFileIdByName, HttpStatusCode } from "../helpers/global-helpers";
import { ApiTestFixtures, test } from "../helpers/api-test-fixtures";

const ENDPOINT = `/api/contact-zoo`;

test.describe(`ContactZoo page response tests`, () => {
  test.beforeEach(async ({ apiRequest }) => {
    await updateContactZooPage({ apiRequest });
  });

  test.afterEach(async ({ apiRequest }) => {
    await deleteContactZooPage({ apiRequest });
  });

  test(`
      GIVEN an empty contact zoo page
      WHEN call method PUT ${ENDPOINT}
      AND call method GET ${ENDPOINT}
      SHOULD get a correct response
      `,
    checkContactZooPageResponseTest
  );
});

async function checkContactZooPageResponseTest({
  apiRequest
}: {
  apiRequest: ApiTestFixtures['apiRequest'];
}) {
  const expectedConcatZooPageResponse = {
    data: {
      blocks: [
        MOCK_HERO,
        MOCK_TEXT_AND_MEDIA,
        MOCK_IMAGE_WITH_BUTTON_GRID,
        MOCK_TICKETS,
        {
          ...MOCK_HOME_SERVICES.cards,
          __component: `shared.cards`,
        },
      ],
      seo: MOCK_SEO
    }
  };

  const queryParams = {
    populate: [
      `blocks.infoCard`,
      `blocks.scheduleCard`,
      `blocks.scheduleCard.timetable`,
      `blocks.image`,
      `blocks.media`,
      `blocks.button`,
      `blocks.largeImage`,
      `blocks.smallImage`,
      `blocks.subsidizedTickets`,
      `blocks.cards`,
      `blocks.cards.image`,
      `blocks.cards.labels`,
      `seo`,
    ],
  };

  const contactZooPageResponse = await apiRequest(
    `${ENDPOINT}?${qs.stringify(queryParams)}`
  );

  const contactZooPageData = await contactZooPageResponse.json();

  const heroBlock = contactZooPageData.data.blocks.find((block) => block.__component === 'shared.hero');
  const textAndMediaBlock = contactZooPageData.data.blocks.find((block) => block.__component === 'shared.text-and-media');
  const imageWithButtonGridBlock = contactZooPageData.data.blocks.find((block) => block.__component === 'shared.image-with-button-grid');
  const ticketsBlock = contactZooPageData.data.blocks.find((block) => block.__component === 'shared.tickets');
  const servicesBlock = contactZooPageData.data.blocks.find((block) => block.__component === 'shared.cards');

  await expect({
    data: {
      blocks: [
        {
          title: heroBlock.title,
          __component: heroBlock.__component,
          infoCard: {
            title: heroBlock.infoCard.title,
            description: heroBlock.infoCard.description
          },
          scheduleCard: {
            title: heroBlock.scheduleCard.title,
            timetable: [
              {
                days: heroBlock.scheduleCard.timetable[0].days,
                time: heroBlock.scheduleCard.timetable[0].time,
                ticketsOfficeTime: heroBlock.scheduleCard.timetable[0].ticketsOfficeTime
              }
            ]
          },
        },
        {
          __component: textAndMediaBlock.__component,
          title: textAndMediaBlock.title,
          description: textAndMediaBlock.description,
          contentOrder: textAndMediaBlock.contentOrder,
          viewFootsteps: textAndMediaBlock.viewFootsteps,
        },
        {
          __component: imageWithButtonGridBlock.__component,
          title: imageWithButtonGridBlock.title,
          description: imageWithButtonGridBlock.description,
          button: {
            link: imageWithButtonGridBlock.button.link,
            label: imageWithButtonGridBlock.button.label
          }
        },
        {
          __component: ticketsBlock.__component,
          title: ticketsBlock.title,
          description: ticketsBlock.description,
          subsidizedTickets: [
            {
              category: ticketsBlock.subsidizedTickets[0].category,
              description: ticketsBlock.subsidizedTickets[0].description,
              price: ticketsBlock.subsidizedTickets[0].price,
              frequency: ticketsBlock.subsidizedTickets[0].frequency,
            },
          ],
          note: ticketsBlock.note,
          link: ticketsBlock.link,
        },
        {
          __component: servicesBlock.__component,
          title: servicesBlock.title,
          cards: [
            {
              title: servicesBlock.cards[0].title,
              description: servicesBlock.cards[0].description,
              link: servicesBlock.cards[0].link,
              labels: [{
                text: servicesBlock.cards[0].labels[0].text
              }]
            }
          ],
        },
      ],
      seo: {
        metaTitle: contactZooPageData.data.seo.metaTitle,
        metaDescription: contactZooPageData.data.seo.metaDescription,
        keywords: contactZooPageData.data.seo.keywords
      }
    }
  }, 'Contact zoo page response corrected')
    .toEqual(expectedConcatZooPageResponse);

  await expect(heroBlock.image.url)
    .not
    .toBeNull();

  await expect(textAndMediaBlock.media.url)
    .not
    .toBeNull();

  await expect(imageWithButtonGridBlock.largeImage.url)
    .not
    .toBeNull();

  await expect(imageWithButtonGridBlock.smallImage.url)
    .not
    .toBeNull();

  await expect(servicesBlock.cards[0].image.url)
    .not
    .toBeNull();
}

async function updateContactZooPage({
  apiRequest
}: {
  apiRequest: ApiTestFixtures['apiRequest'];
}) {
  try {
    const fileId = await getFileIdByName({ apiRequest });

    const response = await apiRequest(ENDPOINT, {
      method: 'PUT',
      data: {
        data: {
          blocks: [
            {
              ...MOCK_HERO,
              image: fileId
            },
            {
              ...MOCK_TEXT_AND_MEDIA,
              media: fileId
            },
            {
              ...MOCK_IMAGE_WITH_BUTTON_GRID,
              largeImage: fileId,
              smallImage: fileId
            },
            MOCK_TICKETS,
            {
              __component: `shared.cards`,
              title: MOCK_HOME_SERVICES.cards.title,
              cards: [
                {
                  ...MOCK_HOME_SERVICES.cards.cards[0],
                  image: fileId
                }
              ],
            }
          ],
          seo: MOCK_SEO
        },
      }
    });

    await expect(response.status(), 'Contact zoo page should be updated with status 200')
      .toEqual(HttpStatusCode.Ok);
  } catch (error) {
    throw new Error(`Failed to update test contact zoo page: ${error.message}`)
  }
}

async function deleteContactZooPage({
  apiRequest
}: {
  apiRequest: ApiTestFixtures['apiRequest'];
}) {
  try {
    const response = await apiRequest(ENDPOINT, {
      method: 'DELETE'
    });

    await expect(response.status(), 'Contact zoo page should be deleted with status 204')
      .toEqual(HttpStatusCode.NoContent);
  } catch (error) {
    throw new Error(`Failed to delete test contact zoo page: ${error.message}`)
  }
}
