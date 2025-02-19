"use server";
import {AccountServiceClient} from "@ayasofyazilim/core-saas/AccountService";
import {AdministrationServiceClient} from "@ayasofyazilim/core-saas/AdministrationService";
import {IdentityServiceClient} from "@ayasofyazilim/core-saas/IdentityService";
import {SaasServiceClient} from "@ayasofyazilim/core-saas/SaasService";
import {AdministrationServiceClient as AdministrationServiceClient_Unirefund} from "@ayasofyazilim/saas/AdministrationService";
import {ContractServiceClient} from "@ayasofyazilim/saas/ContractService";
import {CRMServiceClient} from "@ayasofyazilim/saas/CRMService";
import {ExportValidationServiceClient} from "@ayasofyazilim/saas/ExportValidationService";
import {FinanceServiceClient} from "@ayasofyazilim/saas/FinanceService";
import {LocationServiceClient} from "@ayasofyazilim/saas/LocationService";
import {RefundServiceClient} from "@ayasofyazilim/saas/RefundService";
import {SettingServiceClient} from "@ayasofyazilim/saas/SettingService";
import {TagServiceClient} from "@ayasofyazilim/saas/TagService";
import {TravellerServiceClient} from "@ayasofyazilim/saas/TravellerService";
import {auth} from "@repo/utils/auth/next-auth";
import type {Session} from "@repo/utils/auth";

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
export async function getAdministrationServiceClient_Unirefund(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new AdministrationServiceClient_Unirefund({
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
