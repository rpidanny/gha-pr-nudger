import {ConstructorParams, JsonPayload} from '.'

export class AppError extends Error {
  private code: string
  private details?: Record<string, unknown>

  /* istanbul ignore next */
  constructor({
    code = 'INTERNAL_SERVER_ERROR',
    message = 'Internal Server Error',
    details,
    err,
  }: ConstructorParams = {}) {
    super(message)

    // Override prototype because Typescript doesn't handle Error inheritence correctly
    // ref: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, new.target.prototype)

    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.code = code
    this.message = message
    this.details = details

    if (err) {
      this.stack = err.stack
    }
  }

  toJson(): JsonPayload {
    const payload: JsonPayload = {
      code: this.code,
      message: this.message,
    }

    if (this.details) {
      payload.details = this.details
    }

    return payload
  }
}
