export class GenericResponseModel<T> {
  private _instId: number;
  private _serviceName: string; // "GET_CHALLENGE"
  private _sessionId: string;
  private _decisonPageRequired: boolean;
  private _data: T[] | T | any;

  get data() {
    return this._data;
  }

  set data(value: T[] | T | any) {
    this._data = value;
  }

  get instId() {
    return this._instId;
  }

  set instId(value: number) {
    this._instId = value;
  }

  get serviceName() {
    return this._serviceName;
  }

  set serviceName(value: string) {
    this._serviceName = value;
  }

  get sessionId() {
    return this._sessionId;
  }

  set sessionId(value: string) {
    this._sessionId = value;
  }

  get decisonPageRequired() {
    return this._decisonPageRequired;
  }

  set decisonPageRequired(value: boolean) {
    this._decisonPageRequired = value;
  }
}
