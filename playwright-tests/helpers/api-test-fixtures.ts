import { APIResponse, test as base, request } from '@playwright/test';

type PlaywrightRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  data?: any;
};

export type ApiTestFixtures = {
  apiRequest: (endpoint: string, options?: PlaywrightRequestOptions) => Promise<APIResponse>;
};

// https://playwright.dev/docs/test-fixtures
// Extend base test by providing "apiRequest"
export const test = base.extend<ApiTestFixtures>({
  apiRequest: async ({ }, use) => {
    // Create apiContext with default settings
    const apiContext = await request.newContext({
      baseURL: process.env.SERVER_URL || 'http://localhost:1337',
      extraHTTPHeaders: {
        // Disable cache for test request
        'Cache-Control': 'no-cache',
      },
    });

    const apiRequest = async (
      endpoint: string,
      options: PlaywrightRequestOptions = {}
    ) => {
      const method = options.method?.toLowerCase() || 'get';
      console.log(endpoint)
      const response = await apiContext[method](endpoint, options)
      return response;
    };

    // Use the fixture value in the test
    await use(apiRequest);

    // Clean up the apiContext
    await apiContext.dispose();
  },
});

export { expect } from '@playwright/test';