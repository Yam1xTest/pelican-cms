import { expect, test as setup } from './helpers/api-test-fixtures';
import fs from 'fs';
import FormData from 'form-data';
import { HttpStatusCode } from "./helpers/global-helpers";

setup('upload test files', async ({ apiRequest }) => {
  const files = [
    {
      name: '[E2E-SMOKE]-tiger.png',
      path: './playwright-tests/fixtures/[E2E-SMOKE]-tiger.png'
    },
    {
      name: '[E2E-SMOKE]-new-document.pdf',
      path: './playwright-tests/fixtures/[E2E-SMOKE]-new-document.pdf'
    },
  ];

  const formData = new FormData();

  files.forEach((file) => {
    formData.append(
      'files',
      fs.readFileSync(file.path),
      file.name
    );
  });

  try {
    const response = await apiRequest('/api/upload', {
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
      },
      data: formData.getBuffer()
    });

    expect(response.status(), 'Files should be uploaded with status 201')
      .toEqual(HttpStatusCode.Created);
  } catch (error) {
    throw new Error(`Failed to upload files: ${error.message}`)
  }
});