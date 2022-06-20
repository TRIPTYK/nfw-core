export abstract class JsonApiError {
  public constructor (public status: number, public message: string) {

  }
}
