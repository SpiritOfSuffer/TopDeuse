export class AccessDeniedException extends Error {
    constructor() {
      super();
      this.message = 'Access Denied';
    }
  }