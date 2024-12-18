"use server";
import type { GetApiAccountMyProfileResponse } from "@ayasofyazilim/saas/AccountService";
import { AccountServiceClient } from "@ayasofyazilim/saas/AccountService";
import type { User } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "auth";
import { isApiError } from "src/app/api/util";
import { getAccountServiceClient } from "src/lib";
import { getBaseLink } from "src/utils";

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details: string | null;
    data: Record<string, unknown>;
    validationErrors: string | null;
  };
}

const TOKEN_URL = `${process.env.BASE_URL}/connect/token`;
const OPENID_URL = `${process.env.BASE_URL}/.well-known/openid-configuration`;

interface TokenError {
  error: string;
  error_description: string;
  error_uri: string;
}

export async function signOutServer() {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    return { error: "Unknown error" };
  }
  redirect(getBaseLink("login", true));
}
export async function signInServer({
  userIdentifier,
  password,
  tenantId,
}: {
  userIdentifier: string;
  password: string;
  tenantId?: string;
}) {
  try {
    await signIn("credentials", {
      username: userIdentifier,
      password,
      tenantId,
      redirect: false,
    });
    return {
      status: 200,
    };
  } catch (error) {
    if (error !== null && typeof error === "object" && "message" in error) {
      return {
        status: 400,
        description: error.message,
      };
    }
    return {
      status: 400,
      description: "Unknown error",
    };
  }
}
export async function signUpServer({
  userName,
  email,
  password,
}: {
  userName: string;
  email: string;
  password: string;
}) {
  try {
    const client = await getAccountServiceClient({
      __tenant: process.env.TENANT_ID || "",
    });
    await client.account.postApiAccountRegister({
      requestBody: {
        userName,
        emailAddress: email,
        password,
        appName: process.env.APP_NAME || "",
      },
    });
    return {
      status: 200,
    };
  } catch (error: unknown) {
    if (isApiError(error)) {
      const errorBody = error.body as ApiErrorResponse;
      return {
        status: error.status,
        description: `SignUp server error ${error.statusText}: ${errorBody.error.message.split(",").join("\n")}`,
      };
    }
    return {
      status: 500,
      description: "Unknown error while signing up",
    };
  }
}
export async function sendPasswordResetCodeServer({
  email,
}: {
  email: string;
}) {
  try {
    const client = await getAccountServiceClient({
      __tenant: process.env.TENANT_ID || "F3B84A96-8A04-87B7-D3C3-3A1675322587",
    });
    await client.account.postApiAccountSendPasswordResetCode({
      requestBody: {
        email,
        appName: process.env.APP_NAME || "",
      },
    });
    return {
      status: 200,
    };
  } catch (error: unknown) {
    if (isApiError(error)) {
      return {
        status: error.status,
        description: error.statusText,
      };
    }
    return {
      status: 500,
      description: "Unknown error while sending password reset code",
    };
  }
}
export async function getMyProfile(
  token: string,
): Promise<GetApiAccountMyProfileResponse> {
  const client = new AccountServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const profile = await client.profile.getApiAccountMyProfile();
  return profile;
}
export async function getTenantData(token: string) {
  const client = new AccountServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const session = await client.sessions.getApiAccountSessions();
  const activeSession = session.items?.[0];
  if (!activeSession?.tenantId || !activeSession.tenantName) {
    return undefined;
  }
  return {
    tenantId: activeSession.tenantId,
    tenantName: activeSession.tenantName,
  };
}

export async function signInWithCredentials(credentials: {
  username: string;
  password: string;
  tenantId?: string;
}): Promise<User | TokenError> {
  "use server";
  const scopes: string = await fetch(OPENID_URL)
    .then((response) => response.json())
    .then(
      (json: { scopes_supported?: string[] }) =>
        json.scopes_supported?.join(" ") || "",
    );
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("X-Requested-With", "XMLHttpRequest");
  myHeaders.append("__tenant", credentials.tenantId || "");
  const urlencoded = new URLSearchParams();
  const urlEncodedContent: Record<string, string> = {
    grant_type: "password",
    client_id: "Angular",
    username: credentials.username,
    password: credentials.password,
    scope: scopes,
  };
  Object.keys(urlEncodedContent).forEach((key) => {
    urlencoded.append(key, urlEncodedContent[key]);
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };
  const response = await fetch(TOKEN_URL, requestOptions);
  const json: User | TokenError = (await response.json()) as User | TokenError;
  return {
    ...json,
    userName: credentials.username,
  };
}
export async function obtainAccessTokenByRefreshToken(refreshToken: string) {
  "use server";
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("X-Requested-With", "XMLHttpRequest");
  const urlencoded = new URLSearchParams();
  const urlEncodedContent: Record<string, string> = {
    client_id: "Angular",
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };
  Object.keys(urlEncodedContent).forEach((key) => {
    urlencoded.append(key, urlEncodedContent[key]);
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };
  const response = await fetch(TOKEN_URL, requestOptions);
  const json: User | TokenError = (await response.json()) as User | TokenError;
  return json;
}
export async function getGrantedPolicies(token: string) {
  const client = new AccountServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const configuration =
    await client.abpApplicationConfiguration.getApiAbpApplicationConfiguration();
  const grantedPolicies = configuration.auth?.grantedPolicies;
  return grantedPolicies;
}
