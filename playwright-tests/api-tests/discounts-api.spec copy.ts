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

const ENDPOINT = "/api/discounts";

const queryParams = {
  populate: {
    rules: {
      populate: ['terms', 'docs', 'basis']
    },
  }
};

function removeIds(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeIds);
  } else if (obj && typeof obj === 'object') {
    const { id, ...rest } = obj;
    return Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [k, removeIds(v)])
    );
  }
  return obj;
}

test.describe(`Discounts response tests`, () => {
  test.beforeEach(async () => {
    await deleteDiscountsByTitle(DISCOUNTS_TITLE);
    await createDiscountAsync();
  });

  test.afterEach(async () => {
    await deleteDiscountsByTitle(DISCOUNTS_TITLE);
  });

  test(`GIVEN an empty discounts collection WHEN call method POST ${ENDPOINT} AND call method GET ${ENDPOINT} SHOULD get a correct response`, async () => {

    const response = (await axios.get(getStrapiUrl({
      path: `${ENDPOINT}?${qs.stringify(queryParams, { encode: false })}`
    })));

    const discount = getDiscountByTitle(response.data, DISCOUNTS_TITLE);

    expect(discount).toBeTruthy();

    expect({
      data: [
        {
          title: discount?.title,
          note: discount?.note,
          price: discount?.price,
          rules: removeIds(discount?.rules),
        },
      ],
    }).toEqual({
      data: [
        {
          title: DISCOUNTS_TITLE,
          note: NOTE,
          price: PRICE,
          rules: RULES,
        },
      ],
    });
  });
});

async function createDiscountAsync() {
  try {
    const response = await axios.post(getStrapiUrl({ path: ENDPOINT }), {
      data: {
        title: DISCOUNTS_TITLE,
        note: NOTE,
        price: PRICE,
        rules: RULES,
      },
    });

    expect(response.status).toBe(HttpStatusCode.Created);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Create discount failed:", error.response?.data);
    }
    throw error;
  }
}

async function deleteDiscountsByTitle(title: string) {
  const response = await axios.get(
    getStrapiUrl({ path: `${ENDPOINT}?populate=*` })
  );
  const discount = getDiscountByTitle(response.data, title);

  if (discount?.id) {
    const deleteResponse = await axios.delete(
      getStrapiUrl({ path: `${ENDPOINT}/${discount.id}` })
    );

    expect(deleteResponse.status, "Discount deletion status").toBe(
      HttpStatusCode.NoContent
    );
  }
}

function getDiscountByTitle(discountsResponse: DiscountsResponse, title: string) {
  return discountsResponse.data.find((d) => d.title === title);
}

type DiscountsResponse = {
  data: {
    id?: number;
    documentId?: string;
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
};
