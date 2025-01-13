import { ApiError } from "@ayasofyazilim/core-saas/AccountService";

export interface BaseServerResponse {
  message: string;
}

export interface SuccessServerResponse<T> {
  type: "success";
  data: T;
  message: string;
}
export interface ApiErrorServerResponse {
  type: "api-error";
  data: ApiError["message"];
  message: string;
}

export type ServerResponse<T> =
  | ApiErrorServerResponse
  | SuccessServerResponse<T>;

// export type ErrorTypes = ApiErrorServerResponse;
// export interface ErrorServerResponse {
//   type: "error";
//   data: unknown;
// }
