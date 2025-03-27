import {AdministrationServiceClient} from "@ayasofyazilim/saas/AdministrationService";
import {ContractServiceClient} from "@ayasofyazilim/saas/ContractService";
import {CRMServiceClient} from "@ayasofyazilim/saas/CRMService";
import {ExportValidationServiceClient} from "@ayasofyazilim/saas/ExportValidationService";
import {FinanceServiceClient} from "@ayasofyazilim/saas/FinanceService";
import {LocationServiceClient} from "@ayasofyazilim/saas/LocationService";
import {RefundServiceClient} from "@ayasofyazilim/saas/RefundService";
import {SettingServiceClient} from "@ayasofyazilim/saas/SettingService";
import {TagServiceClient} from "@ayasofyazilim/saas/TagService";
import {TravellerServiceClient} from "@ayasofyazilim/saas/TravellerService";
import {Session} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";

const HEADERS = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json",
};

export async function getCRMServiceClient(session?: Session | null) {
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

export async function getSettingServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new SettingServiceClient({
    BASE: process.env.BASE_URL,
    TOKEN: token,
    HEADERS,
  });
}

export async function getContractServiceClient(session?: Session | null) {
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
