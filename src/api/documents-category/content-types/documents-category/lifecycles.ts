import slugify from "slugify";

module.exports = {
  async beforeCreate({ params }) {
    await translit(params)
  },

  async beforeUpdate({ params }) {
    await translit(params)
  },
}


async function translit(params: any) {
  if (params.data.title) {
    let slug = slugify(params.data.title, {
      lower: true,
      strict: true
    });

    params.data.slug = slug;
  }
}