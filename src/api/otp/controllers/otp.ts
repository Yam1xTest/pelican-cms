/**
 * otp controller
 */

/**
 * otp controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import { Totp } from "time2fa";

const { ValidationError, ApplicationError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

export default factories.createCoreController("api::otp.otp", ({ strapi }) => ({
  async register(ctx, next) {
    await strapi.controllers["plugin::users-permissions.auth"].register(
      ctx,
      next
    );

    ctx.send({ success: true });
  },

  async login(ctx, next) {
    console.log('TEST')
    const provider = ctx.params.provider || "local";

    await strapi.controllers["plugin::users-permissions.auth"].callback(
      ctx,
      next
    );

    if (provider === "local" || provider === "email") {
      try {
        const body: any = ctx.body;

        const user = await strapi
          .documents("plugin::users-permissions.user")
          .findOne({ documentId: body.user.documentId });

        let verifyType: "totp" = "totp";

        ctx.send({ email: user.email, verifyType });
      } catch (err) {
        ctx.body = err;
      }
    }
  },

  async verifyCode(ctx) {
    const { code, email, type } = ctx.request.body;

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { email } });

    if (!user) throw new ValidationError("Code verification failed");

    let isValid = false;

    isValid = await strapi
      .service("api::otp.otp")
      .verifyTotp(code, user.totpSecret);

    if (!isValid) throw new ValidationError("Code verification failed");

    const userDto: any = await sanitizeUser(user, ctx);

    ctx.send({
      jwt: strapi.plugins["users-permissions"].services.jwt.issue({
        id: userDto.id,
      }),
      user: await sanitizeUser(userDto, ctx),
    });
  },

  async generateTotpSecret(ctx) {
    if (!ctx.state.user) {
      throw new ApplicationError(
        "You must be authenticated to setup Authentication App"
      );
    }

    const data = Totp.generateKey({
      issuer: "StrapiOtp",
      user: ctx.state.user.email,
    });

    ctx.send({ email: data.user, secret: data.secret, url: data.url });
  },

  async saveTotpSecret(ctx) {
    if (!ctx.state.user) {
      throw new ApplicationError(
        "You must be authenticated to setup Authentication App"
      );
    }

    const { secret, code } = ctx.request.body;
    const success = Totp.validate({ passcode: code, secret });

    if (!success) {
      throw new ValidationError("Secret and code validation failed");
    }

    await strapi.plugins["users-permissions"].services.user.edit(
      ctx.state.user.id,
      {
        totpSecret: secret,
        enableTotp: true,
      }
    );

    ctx.send({ success });
  },

  async totpEnabled(ctx) {
    const user = await strapi
      .documents("plugin::users-permissions.user")
      .findOne({ documentId: ctx.state.user.documentId });

    const enabled = user.enableTotp && user.totpSecret;

    ctx.send({ enabled });
  },
}));

