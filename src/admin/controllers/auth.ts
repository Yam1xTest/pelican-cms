// ./src/admin/controllers/auth.ts
export default ({ strapi: admin }: { strapi: any }) => ({
  async login(ctx) {
    // Кастомная логика перед входом (например, проверка домена email)
    const { email, password } = ctx.request.body;
    console.log(email)
    if (!email.endsWith("@mycompany.com")) {
      return ctx.unauthorized("Доступ разрешен только для корпоративных email");
    }

    // Стандартная логика входа Strapi
    const result = await admin.services.auth.login(ctx);

    // Кастомная логика после входа (например, логирование)
    console.log(`Admin ${email} вошел в систему`);

    return result;
  },
})