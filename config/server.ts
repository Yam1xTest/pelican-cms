export default ({ env }) => {
  const serverUrl = env('SERVER_URL', 'http://localhost:1337');

  if (!serverUrl) {
    throw new Error('SERVER_URL is not set or is empty');
  }

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: serverUrl,
  };
};