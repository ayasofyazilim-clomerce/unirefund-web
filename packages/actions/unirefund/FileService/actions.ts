"use server";
import {
  GetApiFileServiceFileRelationEntitiesData,
  GetApiFileServiceFileRelationsData,
  GetApiFileServiceFilesData,
  GetApiFileServiceFileTypeGroupsData,
  GetApiFileServiceFileTypeGroupsRulesetData,
  GetApiFileServiceFileTypeMimeTypesData,
  GetApiFileServiceFileTypesData,
  GetApiFileServiceMimeTypesData,
  GetApiFileServiceProvidersData,
} from "@ayasofyazilim/saas/FileService";
import {structuredError, structuredSuccessResponse} from "@repo/utils/api";
import {Session} from "@repo/utils/auth";
import {getFileServiceClient} from "../lib";

export async function getFileApi(data: GetApiFileServiceFilesData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.file.getApiFileServiceFiles(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getFileDownloadApi(id: string, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.file.getApiFileServiceFilesByIdDownload({id});
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getFileRelationsApi(data: GetApiFileServiceFileRelationsData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileRelation.getApiFileServiceFileRelations(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getFileRelationEntitiesApi(
  data: GetApiFileServiceFileRelationEntitiesData,
  session?: Session | null,
) {
  try {
    const client = await getFileServiceClient(session);
    const response = await client.fileRelationEntity.getApiFileServiceFileRelationEntities(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getFileTypesApi(data: GetApiFileServiceFileTypesData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const response = await client.fileType.getApiFileServiceFileTypes(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getFileTypeGroupsApi(data: GetApiFileServiceFileTypeGroupsData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const response = await client.fileTypeGroup.getApiFileServiceFileTypeGroups(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getApiFileTypeGroupsRulesetApi(
  data?: GetApiFileServiceFileTypeGroupsRulesetData,
  session?: Session | null,
) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileTypeGroup.getApiFileServiceFileTypeGroupsRuleset(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getFileTypeMimeTypesApi(data: GetApiFileServiceFileTypeMimeTypesData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const response = await client.fileTypeMimeType.getApiFileServiceFileTypeMimeTypes(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMimeTypesApi(data: GetApiFileServiceMimeTypesData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const response = await client.mimeType.getApiFileServiceMimeTypes(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getProvidersApi(data: GetApiFileServiceProvidersData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const response = await client.provider.getApiFileServiceProviders(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
