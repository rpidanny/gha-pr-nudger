export interface JsonPayload {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface ConstructorParams {
  code?: string
  message?: string
  details?: Record<string, unknown>
  err?: Error
}
