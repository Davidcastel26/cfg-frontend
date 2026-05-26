import { api } from './client';
import type { ImportResult } from '../types/domain';

export const importApi = {
  uploadExcel: (
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<ImportResult> =>
    api
      .post<ImportResult>('/import/excel', file, {
        headers: { 'Content-Type': 'application/octet-stream' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      })
      .then((r) => r.data),
};
