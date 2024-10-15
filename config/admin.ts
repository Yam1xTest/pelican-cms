export default ({ env }) => ({
  url: env('SERVER_URL', 'http://localhost:1337'),
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    // secret: "xgb5x7cdhbCNbveTtVtq2Q==",
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
    // salt: "hR/XPb6VISQZg71UPYijWg==",
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
      // salt: "3pCV+b5ISok+iqUiZtTpQQ==",
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
