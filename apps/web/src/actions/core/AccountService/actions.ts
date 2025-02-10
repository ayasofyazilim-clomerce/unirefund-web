"use server";
import type {
  GetApiAbpApplicationConfigurationData,
  GetApiAccountSecurityLogsData,
  GetApiAccountSessionsData,
} from "@ayasofyazilim/saas/AccountService";
import {structuredSuccessResponse} from "@repo/utils/api";
import {signIn} from "@repo/utils/auth/next-auth";
import {getAccountServiceClient, structuredError, structuredResponse} from "src/lib";

export async function getTenantByNameApi(name: string) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.abpTenant.getApiAbpMultiTenancyTenantsByNameByName({name});
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function signInServerApi({
  tenantId,
  userName,
  password,
}: {
  tenantId: string;
  userName: string;
  password: string;
}) {
  try {
    await signIn("credentials", {
      username: userName,
      password,
      tenantId,
      redirect: false,
    });
    return structuredSuccessResponse("");
  } catch (error) {
    const err = error as {message: string};
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}
export async function sendPasswordResetCodeApi({tenantId, email}: {tenantId: string; email: string}) {
  try {
    const client = await getAccountServiceClient({
      __tenant: tenantId || "",
    });
    const response = await client.account.postApiAccountSendPasswordResetCode({
      requestBody: {
        email,
        appName: process.env.CLIENT_ID || "",
        returnUrl: "",
      },
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function verifyPasswordResetTokenApi({
  tenantId,
  resetToken,
  userId,
}: {
  tenantId: string;
  resetToken: string;
  userId: string;
}) {
  try {
    const client = await getAccountServiceClient({
      __tenant: tenantId || "",
    });
    const response = await client.account.postApiAccountVerifyPasswordResetToken({
      requestBody: {
        userId,
        resetToken,
      },
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function resetPasswordApi({
  tenantId,
  userId,
  resetToken,
  password,
}: {
  tenantId: string;
  userId: string;
  resetToken: string;
  password: string;
}) {
  try {
    const client = await getAccountServiceClient({
      __tenant: tenantId || "",
    });
    const response = await client.account.postApiAccountResetPassword({
      requestBody: {
        userId,
        resetToken,
        password,
      },
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
//unupdated functions
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
    return structuredSuccessResponse({});
  } catch (error) {
    return structuredError(error);
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
    return structuredError(error);
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
    return structuredError(error);
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
