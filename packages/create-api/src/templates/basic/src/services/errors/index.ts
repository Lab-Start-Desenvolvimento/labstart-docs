export class UserAlreadyExistsError extends Error {
  constructor() {
    super('User with same email already exists.')
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials.')
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found.')
  }
}

export class AdminRequiredError extends Error {
  constructor() {
    super('Administrator privileges required.')
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized.')
  }
}