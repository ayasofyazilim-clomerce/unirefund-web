"use server";
import type {
  GetApiAbpApplicationConfigurationData,
  GetApiAccountSecurityLogsData,
  GetApiAccountSessionsData,
} from "@ayasofyazilim/saas/AccountService";
import {
  getAccountServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

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
export async function getApplicationConfigurationApi(
  data: GetApiAbpApplicationConfigurationData,
) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse =
      await client.abpApplicationConfiguration.getApiAbpApplicationConfiguration(
        data,
      );
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
