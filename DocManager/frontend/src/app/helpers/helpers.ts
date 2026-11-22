import { isDevMode } from '@angular/core';
export const API_URL = isDevMode() ? 'http://localhost:5000/api' : '/api';

export function saveBlob(blob: Blob, fileName: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function errorMessage(e: any): string {
  if (e.status === 403) return 'You don’t have permission to do this.';
  if (typeof e.error === 'string' && e.error) return e.error;
  const errs = e.error?.errors ? Object.values(e.error.errors).flat() : [];
  return errs.length ? errs.join(' ') : 'Something went wrong. Check the details and try again.';
}

export function daysLeft(date?: string): number | null {
  return date ? Math.ceil((new Date(date).getTime() - Date.now()) / 86400000) : null;
}
