export class GlobalError extends Error {
  public statusCode: number;
  public message: string;

  constructor(message: string, statusCode: number) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
