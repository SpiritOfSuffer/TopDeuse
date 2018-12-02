export class InvalidCredentialsException extends Error {
    constructor() {
      super();
      this.message = 'Invalid Credentials';
    }
  } 