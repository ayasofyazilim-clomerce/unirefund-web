"use server";
import {
  PostApiFileServiceFileRelationEntitiesData,
  PostApiFileServiceFileRelationsData,
  PostApiFileServiceFilesData,
  PostApiFileServiceFileTypeGroupsData,
  PostApiFileServiceFileTypeMimeTypesData,
  PostApiFileServiceFileTypesData,
  PostApiFileServiceMimeTypesData,
  PostApiFileServiceProvidersData,
} from "@repo/saas/FileService";
import { structuredError, structuredResponse } from "@repo/utils/api";
import { Session } from "@repo/utils/auth";
import { getFileServiceClient } from "../lib";

export async function postFileApi(data: PostApiFileServiceFilesData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.file.postApiFileServiceFiles(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postFileTriggerAiProcess(id: string, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.file.postApiFileServiceFilesByIdTriggerAiProcess({ id });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postFileRelationsApi(data: PostApiFileServiceFileRelationsData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileRelation.postApiFileServiceFileRelations(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postFileRelationEntitiesApi(
  data: PostApiFileServiceFileRelationEntitiesData,
  session?: Session | null,
) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileRelationEntity.postApiFileServiceFileRelationEntities(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postFileTypesApi(data: PostApiFileServiceFileTypesData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileType.postApiFileServiceFileTypes(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postFileTypeGroupsApi(data: PostApiFileServiceFileTypeGroupsData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileTypeGroup.postApiFileServiceFileTypeGroups(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postFileTypeMimeTypesApi(
  data: PostApiFileServiceFileTypeMimeTypesData,
  session?: Session | null,
) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileTypeMimeType.postApiFileServiceFileTypeMimeTypes(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMimeTypesApi(data: PostApiFileServiceMimeTypesData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.mimeType.postApiFileServiceMimeTypes(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postProviderApi(data: PostApiFileServiceProvidersData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.provider.postApiFileServiceProviders(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
