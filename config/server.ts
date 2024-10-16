export default ({ env }) => {
  const environment = env('ENVIRONMENT', 'local-run');

  const serverUrl = environment === 'local-env'
    ? 'http://pelican.local.tourmalinecore.internal/cms'
    : 'http://localhost:1337';

  console.log('Environment:', environment);
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
