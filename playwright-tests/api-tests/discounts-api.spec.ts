import test, { expect } from "@playwright/test";
import axios, { HttpStatusCode } from "axios";
import { E2E_SMOKE_NAME_PREFIX, getStrapiUrl } from "../helpers/global-helpers";
import qs from "qs";

const DISCOUNTS_TITLE = `${E2E_SMOKE_NAME_PREFIX} Студенты`;
const NOTE = `Один раз в месяц`;
const PRICE = `Бесплатно`;
const RULES = {
  terms: [
    {
      text: `Семьи, имеющие не менее 3-х детей в возрасте до 18 лет, а также детей в возрасте от 18 до 23 лет, обучающихся в образовательных организациях по очной форме обучения`
    }
  ],
  info: `Распространяется на лиц, проживающих на территории города Челябинска`,
  docs: [
    { text: `Удостоверение многодетной семьи ЛИБО справка о признании семьи многодетной;` },
    { text: `Документ, удостоверяющий личность;` },
    { text: `Студенческий билет (для детей от 18 лет до 23 лет).` },
  ],
  basis: [
    {
      title: `Указом Президента РФ от 23 января 2024 г. № 63`,
      link: `https://www.consultant.ru/document/cons_doc_LAW_467710/`,
    },
    {
      title: `Закон Челябинской области от 31.03.2010 г. № 548`,
      link: `https://uszn-miass.ru/images/1698320253-zakon_chel_obl_548_zo_ot_31_03_2010_s_izm.pdf`,
    },
  ],
}
const ENDPOINT = '/api/discounts';

const queryParams = {
  populate: {
    rules: {
      populate: ['terms', 'docs', 'basis']
    },
  }
};

test.describe(`Discounts response tests`, () => {
  test.beforeEach(async () => {
    await deleteDiscountsByTitle({
      title: DISCOUNTS_TITLE
    });

    await createDiscountsAsync();
  });

  test.afterEach(async () => {
    await deleteDiscountsByTitle({
      title: DISCOUNTS_TITLE
    });
  });

  test(`
      GIVEN an empty discounts collection
      WHEN call method POST ${ENDPOINT}
      AND call method GET ${ENDPOINT}
      SHOULD get a correct response
      `,
    checkDiscountsResponseTest
  );
})

async function checkDiscountsResponseTest() {
  const expectedDiscountsResponse = {
    data: [
      {
        title: DISCOUNTS_TITLE,
        note: NOTE,
        price: PRICE,
        rules: RULES,
      }
    ]
  };

  const discountsResponse = (await axios.get(getStrapiUrl({
    path: `${ENDPOINT}?${qs.stringify(queryParams)}`
  }))).data;

  const discountsTest = getDiscountsByTitle({
    discounts: discountsResponse,
    title: DISCOUNTS_TITLE
  });

  await expect({
    data: [
      {
        title: discountsTest.title,
        note: discountsTest.note,
        price: discountsTest.price,
        rules: removeIdsFromRules(discountsTest.rules),
      }
    ]
  }, 'Discounts response corrected')
    .toEqual(expectedDiscountsResponse);

}

async function createDiscountsAsync() {
  const response = await axios.post(`${getStrapiUrl({ path: ENDPOINT })}`, {
    data: {
      title: DISCOUNTS_TITLE,
      note: NOTE,
      price: PRICE,
      rules: RULES,
    }
  });

  await expect(response.status, 'Discounts page creating')
    .toEqual(HttpStatusCode.Created);
}

async function deleteDiscountsByTitle({
  title
}: {
  title: string;
}) {
  const discountsResponse = (await axios.get(getStrapiUrl({ path: `${ENDPOINT}?populate=*` }))).data;

  const discounts = getDiscountsByTitle({
    discounts: discountsResponse,
    title
  });

  if (discounts) {
    const response = await axios.delete(getStrapiUrl({
      path: `${ENDPOINT}/${discounts.id}`
    }));

    await expect(response.status, 'Discounts deletion')
      .toEqual(HttpStatusCode.NoContent);
  }
}

function getDiscountsByTitle({
  discounts,
  title,
}: {
  discounts: DiscountsResponse;
  title: string;
}) {
  return discounts.data.find((discounts) => discounts.title === title);
}

function removeIdsFromRules(rules: any) {
  const clean = JSON.parse(JSON.stringify(rules));
  delete clean.id;

  clean.terms?.forEach((t: any) => delete t.id);
  clean.docs?.forEach((d: any) => delete d.id);
  clean.basis?.forEach((b: any) => delete b.id);

  return clean;
}


type DiscountsResponse = {
  data: {
    id?: number;
    title: string;
    note?: string;
    price: string;
    rules: {
      terms: string[];
      info: string;
      docs: string[];
      basis: {
        title: string;
        link: string;
      }[];
    };
  }[];
}