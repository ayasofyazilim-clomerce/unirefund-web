"use server";
import type {
  GetApiAuditLoggingAuditLogsData,
  GetApiAuditLoggingAuditLogsEntityChangesData,
  GetApiLanguageManagementLanguagesData,
  GetApiLanguageManagementLanguageTextsByResourceNameByCultureNameByNameData,
  GetApiLanguageManagementLanguageTextsData,
  GetApiPermissionManagementPermissionsData,
  GetApiTextTemplateManagementTemplateDefinitionsData,
} from "@ayasofyazilim/saas/AdministrationService";
import {
  getAdministrationServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function getPermissionsApi(
  data: GetApiPermissionManagementPermissionsData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.permissions.getApiPermissionManagementPermissions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getCountrySettingsApi() {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.countrySetting.getApiAdministrationServiceCountrySettings();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTextTemplateApi(
  data: GetApiTextTemplateManagementTemplateDefinitionsData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.textTemplateDefinitions.getApiTextTemplateManagementTemplateDefinitions(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAuditLogsApi(data: GetApiAuditLoggingAuditLogsData) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.auditLogs.getApiAuditLoggingAuditLogs(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAuditLogsEntityChangesApi(
  data: GetApiAuditLoggingAuditLogsEntityChangesData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.auditLogs.getApiAuditLoggingAuditLogsEntityChanges(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getLanguagesApi(
  data: GetApiLanguageManagementLanguagesData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languages.getApiLanguageManagementLanguages(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getLanguageDetailsByIdApi(id: string) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languages.getApiLanguageManagementLanguagesById({ id });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getLanguagesResourcesApi() {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languages.getApiLanguageManagementLanguagesResources();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getLanguagesCultureListApi() {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languages.getApiLanguageManagementLanguagesCultureList();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getLanguageTextsApi(
  data: GetApiLanguageManagementLanguageTextsData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languageTexts.getApiLanguageManagementLanguageTexts(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getLanguageTextsDetailsByResourceNameByCultureNameByNameApi(
  data: GetApiLanguageManagementLanguageTextsByResourceNameByCultureNameByNameData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languageTexts.getApiLanguageManagementLanguageTextsByResourceNameByCultureNameByName(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
