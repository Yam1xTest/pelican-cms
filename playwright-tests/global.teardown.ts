import { expect, test as teardown } from './helpers/api-test-fixtures';
import { E2E_SMOKE_NAME_PREFIX, HttpStatusCode } from './helpers/global-helpers';

teardown('remove test files', async ({ apiRequest }) => {
  const filesResponse = await apiRequest('/api/upload/files');
  const filesData = await filesResponse.json();

  const filesDelete = filesData.filter((file) => file.name?.startsWith(E2E_SMOKE_NAME_PREFIX));

  if (filesDelete.length) {
    for (const { id } of filesDelete) {
      try {
        const response = await apiRequest(`/api/upload/files/${id}`, {
          method: 'DELETE'
        });

        expect(response.status(), 'Files should be deleted with status 200')
          .toEqual(HttpStatusCode.Ok);
      } catch (error) {
        throw new Error(`Failed to delete files: ${error.message}`)
      }
    }
  }
});