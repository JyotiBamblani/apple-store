/**
 * Store operation result types for error handling
 */

/** Success result */
export interface StoreSuccess<T> {
  success: true;
  data: T;
}

/** Error result */
export interface StoreError {
  success: false;
  error: string;
  code?: string;
}

/** Store operation result */
export type StoreResult<T> = StoreSuccess<T> | StoreError;

/** Helper to create success result */
export function createSuccess<T>(data: T): StoreSuccess<T> {
  return { success: true, data };
}

/** Helper to create error result */
export function createError(error: string, code?: string): StoreError {
  return { success: false, error, code };
}

/** Error codes */
export enum StoreErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  STORAGE_ERROR = 'STORAGE_ERROR',
  INVALID_DATA = 'INVALID_DATA',
  NETWORK_ERROR = 'NETWORK_ERROR'
}
