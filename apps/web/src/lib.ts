import type {ApiError} from "@ayasofyazilim/saas/AccountService";
import {AccountServiceClient} from "@ayasofyazilim/saas/AccountService";
import {AdministrationServiceClient} from "@ayasofyazilim/saas/AdministrationService";
import {CRMServiceClient} from "@ayasofyazilim/saas/CRMService";
import {IdentityServiceClient} from "@ayasofyazilim/saas/IdentityService";
import {SaasServiceClient} from "@ayasofyazilim/saas/SaasService";
import {SettingServiceClient} from "@ayasofyazilim/saas/SettingService";
import {ContractServiceClient} from "@ayasofyazilim/saas/ContractService";
import {TravellerServiceClient} from "@ayasofyazilim/saas/TravellerService";
import {TagServiceClient} from "@ayasofyazilim/saas/TagService";
import {LocationServiceClient} from "@ayasofyazilim/saas/LocationService";
import {ExportValidationServiceClient} from "@ayasofyazilim/saas/ExportValidationService";
import {FinanceServiceClient} from "@ayasofyazilim/saas/FinanceService";
import {RefundServiceClient} from "@ayasofyazilim/saas/RefundService";
import type {Session} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {isApiError} from "./app/api/util";

const HEADERS = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json",
};
export async function getIdentityServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new IdentityServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export async function getAccountServiceClient(customHeaders?: Record<string, string>, session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new AccountServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS: {...HEADERS, ...customHeaders},
  });
}

export async function getSaasServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new SaasServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export async function getSettingServiceClient(session?: Session | null): Promise<SettingServiceClient> {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new SettingServiceClient({
    BASE: process.env.BASE_URL,
    TOKEN: token,
    HEADERS,
  });
}

export async function getContractServiceClient(session?: Session | null): Promise<ContractServiceClient> {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new ContractServiceClient({
    BASE: process.env.BASE_URL,
    TOKEN: token,
    HEADERS,
  });
}

export async function getAdministrationServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new AdministrationServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export async function getCRMServiceClient(session?: Session | null): Promise<CRMServiceClient> {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new CRMServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export async function getTravellersServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new TravellerServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export async function getTagServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new TagServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export async function getLocationServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new LocationServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export async function getExportValidationServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new ExportValidationServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export async function getFinanceServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new FinanceServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export async function getRefundServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new RefundServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}

export type ServerResponse<T = undefined> = BaseServerResponse & (ErrorTypes | SuccessServerResponse<T>);

export type ErrorTypes = BaseServerResponse & (ErrorServerResponse | ApiErrorServerResponse);

export interface BaseServerResponse {
  status: number;
  message: string;
}

export interface SuccessServerResponse<T> {
  type: "success";
  data: T;
}
export interface ApiErrorServerResponse {
  type: "api-error";
  data: ApiError["message"];
}
export interface ErrorServerResponse {
  type: "error";
  data: unknown;
}

export function structuredError(error: unknown): ErrorTypes {
  if (isApiError(error)) {
    const body = error.body as
      | {
          error: {message?: string; details?: string};
        }
      | undefined;
    const errorDetails = body?.error || {};
    return {
      type: "api-error",
      data: errorDetails.message || error.statusText || "Something went wrong",
      status: error.status,
      message: errorDetails.details || errorDetails.message || error.statusText || "Something went wrong",
    };
  }
  return {
    type: "error",
    data: error,
    status: 500,
    message: "An error occurred",
  };
}

export interface PagedResult<T> {
  items?: T[] | null;
  totalCount: number;
}

export function structuredResponse<T>(data: T): ServerResponse<T> {
  return {
    type: "success",
    data,
    status: 200,
    message: "",
  };
}
export function structuredSuccessResponse<T>(data: T) {
  return {
    type: "success" as const,
    data,
    status: 200,
    message: "",
  };
}
