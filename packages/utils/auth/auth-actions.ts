"use server";

import { AccountServiceClient } from "@ayasofyazilim/core-saas/AccountService";
import { redirect } from "next/navigation";
import { structuredError, structuredResponse } from "./../api";
import { signOut } from "./auth";

const TOKEN_URL = `${process.env.BASE_URL}/connect/token`;
const OPENID_URL = `${process.env.BASE_URL}/.well-known/openid-configuration`;
const HEADERS = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json",
};

export async function getAccountServiceClient(accessToken?: string) {
  return new AccountServiceClient({
    TOKEN: accessToken,
    BASE: process.env.BASE_URL,
    HEADERS: HEADERS,
  });
}

export async function signOutServer() {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    return { error: "Unknown error" };
  }
  redirect("/login");
}
async function fetchScopes() {
  const scopes = await fetch(OPENID_URL)
    .then((response) => response.json())
    .then(
      (json: { scopes_supported?: string[] }) =>
        json.scopes_supported?.join(" ") || "",
    );
  return scopes;
}
export async function fetchToken(credentials: {
  username: string;
  password: string;
  tenantId?: string;
}) {
  const scopes = await fetchScopes();
  const urlencoded = new URLSearchParams();
  const urlEncodedContent: Record<string, string> = {
    grant_type: "password",
    client_id: "Angular",
    username: credentials.username,
    password: credentials.password,
    scope: scopes,
  };

  Object.entries(urlEncodedContent).forEach(([key, value]) =>
    urlencoded.append(key, value),
  );
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
      __tenant: credentials.tenantId || "F3B84A96-8A04-87B7-D3C3-3A1675322587",
    },
    body: urlencoded,
  });
  return await response.json();
}
export async function fetchNewAccessTokenByRefreshToken(refreshToken: string) {
  const urlencoded = new URLSearchParams();
  const urlEncodedContent: Record<string, string> = {
    client_id: "Angular",
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };
  Object.entries(urlEncodedContent).forEach(([key, value]) =>
    urlencoded.append(key, value),
  );
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: urlencoded,
  });
  return await response.json();
}
async function getUserProfile(accessToken: string) {
  "use server";
  try {
    const client = await getAccountServiceClient(accessToken);
    const data = await client.profile.getApiAccountMyProfile();
    return structuredResponse(data);
  } catch (error) {
    return structuredError(error);
  }
}
async function getTenantData(accessToken: string) {
  "use server";
  try {
    const client = await getAccountServiceClient(accessToken);
    const data = await client.sessions.getApiAccountSessions();
    const activeSession = data.items?.[0];
    if (!activeSession?.tenantId || !activeSession.tenantName) {
      return structuredError({
        body: {
          error: { message: "Something went wrong while getting tenantData" },
        },
      });
    }
    return structuredResponse({
      tenantId: activeSession.tenantId,
      tenantName: activeSession.tenantName,
    });
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUserData(accessToken: string, refresh_token: string) {
  "use server";
  const userProfileResponse = await getUserProfile(accessToken);
  if (userProfileResponse.type !== "success") {
    return Promise.reject("new Error(userProfileResponse.message)");
  }
  const tenantDataResponse = await getTenantData(accessToken);
  if (tenantDataResponse.type !== "success") {
    return Promise.reject("new Error(userProfileResponse.message)");
  }

  return {
    userName: userProfileResponse.data.userName || "",
    email: userProfileResponse.data.email || "",
    name: userProfileResponse.data.name || "",
    surname: userProfileResponse.data.surname || "",
    tenantId: tenantDataResponse.data.tenantId || "",
    tenantName: tenantDataResponse.data.tenantName || "",
    access_token: accessToken,
    refresh_token: refresh_token,
  };
}
