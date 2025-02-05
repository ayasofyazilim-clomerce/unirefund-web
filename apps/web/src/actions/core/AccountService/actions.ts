"use server";
import type {
  GetApiAbpApplicationConfigurationData,
  GetApiAccountSecurityLogsData,
  GetApiAccountSessionsData,
} from "@ayasofyazilim/saas/AccountService";
import {isApiError} from "@repo/utils/api";
import {signIn} from "@repo/utils/auth/next-auth";
import {getAccountServiceClient, structuredError, structuredResponse} from "src/lib";

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
  tenantId,
}: {
  userName: string;
  email: string;
  password: string;
  tenantId?: string;
}) {
  try {
    const client = await getAccountServiceClient({
      __tenant: tenantId || "",
    });

    await client.account.postApiAccountRegister({
      requestBody: {
        userName,
        emailAddress: email,
        password,
        appName: process.env.CLIENT_ID || "",
      },
    });
    return {
      status: 200,
    };
  } catch (error: unknown) {
    if (isApiError(error)) {
      const errorBody = error.body as {error: {message: string}};
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
export async function sendPasswordResetCodeServer({email, tenant}: {email: string; tenant: string}) {
  try {
    const client = await getAccountServiceClient({
      __tenant: tenant,
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

export async function getGrantedPoliciesApi() {
  try {
    const client = await getAccountServiceClient();
    const response = await client.abpApplicationConfiguration.getApiAbpApplicationConfiguration();
    const grantedPolicies = response.auth?.grantedPolicies;
    return grantedPolicies;
  } catch (error) {
    return undefined;
  }
}
export async function getSessionsApi(data: GetApiAccountSessionsData) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.sessions.getApiAccountSessions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getSessionsByIdApi(id: string) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.sessions.getApiAccountSessionsById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getSecurityLogsApi(data: GetApiAccountSecurityLogsData) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.account.getApiAccountSecurityLogs(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getPersonalInfomationApi() {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.profile.getApiAccountMyProfile();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getApplicationConfigurationApi(data: GetApiAbpApplicationConfigurationData) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.abpApplicationConfiguration.getApiAbpApplicationConfiguration(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getProfilePictureApi(id: string) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.account.getApiAccountProfilePictureById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
