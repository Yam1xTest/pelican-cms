export default ({ env }) => {
  const serverUrl = env('SERVER_URL', 'http://localhost:1337');
  console.log('Server url is: ');
  console.log(serverUrl);
  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: env('SERVER_URL', 'http://localhost:1337'),
    app: {
      keys: env.array('APP_KEYS'),
      // keys: "l447ZbufnsvHicHvfpMoJA==,b00dkarNr56Er5mJLMr38w==,+GhweEM/mZi8NbBpkZIpDw==,TNAQ7URlV9PVGg7+zFXr7w==",
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};