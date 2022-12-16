// Errors

export class CustomError extends Error {
  constructor(message, extra = {}) {
    super(message);
    this.isCustomError = true;
    for (const key in extra) {
      this[key] = extra[key];
    }
    this.messages = [message];
  }

  add(message) {
    this.messages.unshift(message);
    this.message = message;
    return this;
  }
}

export class OperationalError extends CustomError {
  constructor(message, extra = {}) {
    super(message, extra);
    this.type = "operational";
  }
}

//For non-response blocking programming errors, use 'console.error(error)'
export class ProgramError extends CustomError {
  constructor(message, extra = {}) {
    super(message, extra);
    this.type = "program";
  }
}

//exporting functions to make invocation less verbose
export const opError = function (message, extra = {}) {
  return new OperationalError(message, extra);
};

export const prgError = function (message, extra = {}) {
  return new ProgramError(message, extra);
};
