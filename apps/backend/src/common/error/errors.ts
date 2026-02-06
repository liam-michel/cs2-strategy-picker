export abstract class DomainError extends Error {
  abstract readonly code: string
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND' as const
}

export class ValidationError extends DomainError {
  readonly code = 'BAD_REQUEST_VALIDATION' as const
}

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED' as const
}

export class ForbiddenError extends DomainError {
  readonly code = 'FORBIDDEN' as const
}
export class InternalServerError extends DomainError {
  readonly code = 'INTERNAL_SERVER_ERROR' as const
}
