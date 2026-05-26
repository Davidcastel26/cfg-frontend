import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types/domain';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

export function toApiError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 0;
    const data = err.response?.data as { message?: string; error?: string; details?: unknown } | undefined;
    return {
      status,
      message: data?.message ?? data?.error ?? err.message ?? 'Request failed',
      details: data?.details,
    };
  }
  return { status: 0, message: (err as Error)?.message ?? 'Unknown error' };
}
