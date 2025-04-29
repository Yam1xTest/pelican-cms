import slugify from "slugify";

module.exports = {
  beforeCreate({ params }) {
    const { data } = params;

    generateSlug(data)
  },

  beforeUpdate({ params }) {
    const { data } = params;

    generateSlug(data)
  },
}

function generateSlug(data: any) {
  if (!data.date) {
    data.date = new Date();
  }

  if (data.title) {
    let slug = slugify(data.title, {
      lower: true,
      strict: true
    });

    if (typeof data.date === 'string') {
      const splitDate = data.date.split('T')[0].split('-');

      data.slug = `${splitDate[0]}/${splitDate[1]}/${splitDate[2]}/${slug}`;
    } else {
      const splitDate = data.date.toISOString().split('T')[0].split('-');

      data.slug = `${splitDate[0]}/${splitDate[1]}/${splitDate[2]}/${slug}`;
    }
  }
}