import { expect, test as teardown } from '@playwright/test';
import { E2E_SMOKE_NAME_PREFIX, getStrapiUrl, HttpStatusCode } from './helpers/global-helpers';

teardown('remove test files', async ({ request }) => {
  const filesResponse = await request.get(getStrapiUrl({ path: '/api/upload/files' }));
  const filesData = await filesResponse.json();

  const filesDelete = filesData.filter((file) => file.name?.startsWith(E2E_SMOKE_NAME_PREFIX));

  if (filesDelete.length) {
    for (const { id } of filesDelete) {
      try {
        const response = await request.delete(getStrapiUrl({ path: `/api/upload/files/${id}` }));
        expect(response.status(), 'Files should be deleted with status 200')
          .toEqual(HttpStatusCode.Ok);
      } catch (error) {
        throw new Error(`Failed to delete files: ${error.message}`)
      }
    }
  }
});