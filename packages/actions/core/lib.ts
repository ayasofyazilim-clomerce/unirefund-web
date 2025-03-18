"use server";
import {AccountServiceClient} from "@ayasofyazilim/core-saas/AccountService";
import {AdministrationServiceClient} from "@ayasofyazilim/core-saas/AdministrationService";
import {IdentityServiceClient} from "@ayasofyazilim/core-saas/IdentityService";
import {SaasServiceClient} from "@ayasofyazilim/core-saas/SaasService";

import type {Session} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";

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

export async function getAdministrationServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new AdministrationServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}
