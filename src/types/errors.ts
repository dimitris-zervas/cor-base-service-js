export interface ResponseError {
  status: number,
  message: string,
  type?: string,
  name?: string,
  path?: string,
}