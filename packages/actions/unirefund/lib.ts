import { AdministrationServiceClient } from "@ayasofyazilim/saas/AdministrationService";
import { ContractServiceClient } from "@repo/saas/ContractService";
import { CRMServiceClient } from "@repo/saas/CRMService";
import { ExportValidationServiceClient } from "@repo/saas/ExportValidationService";
import { FileServiceClient } from "@repo/saas/FileService";
import { FinanceServiceClient } from "@repo/saas/FinanceService";
import { LocationServiceClient } from "@repo/saas/LocationService";
import { RefundServiceClient } from "@repo/saas/RefundService";
import { SettingServiceClient } from "@ayasofyazilim/saas/SettingService";
import { TagServiceClient } from "@repo/saas/TagService";
import { TravellerServiceClient } from "@repo/saas/TravellerService";
import { Session } from "@repo/utils/auth";
import { auth } from "@repo/utils/auth/next-auth";
const HEADERS = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json",
};
// import { client as CRMServiceClient } from "@repo/saas/CRMService"
// const COMMON_CONFIG = {
//   baseUrl: process.env.BASE_URL,
//   auth: () => auth().then((res) => {
//     return res?.user?.access_token
//   }),
//   headers: HEADERS,
// };
// CRMServiceClient.setConfig(COMMON_CONFIG);

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

export async function getFileServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new FileServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}
