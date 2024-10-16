export default ({ env }) => ({
  url: `${env('SERVER_URL', 'http://127.0.0.1:1337')}/admin`,
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
});