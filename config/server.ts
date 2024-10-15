export default ({ env }) => {
  const serverUrl = env('SERVER_URL', 'http://localhost:1337');
  console.log('Server URL:', serverUrl);

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: serverUrl,
    app: {
      keys: env.array('APP_KEYS'),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};
