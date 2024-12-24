export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  // this perfectly explains why this is needed https://github.com/strapi/strapi/issues/13889#issuecomment-1516194973
  url: env("SERVER_URL", "http://localhost:1337"),
  app: {
    keys: env.array("APP_KEYS"),
  },
});