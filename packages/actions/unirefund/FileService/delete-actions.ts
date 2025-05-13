"use server";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {Session} from "@repo/utils/auth";
import {getFileServiceClient} from "../lib";

export async function deleteFileRelationsByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileRelation.deleteApiFileServiceFileRelationsById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteFileRelationEntitiesByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileRelationEntity.deleteApiFileServiceFileRelationEntitiesById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteFileTypesByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileType.deleteApiFileServiceFileTypesById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteFileTypeGroupsByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileTypeGroup.deleteApiFileServiceFileTypeGroupsById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteFileTypeMimeTypesByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileTypeMimeType.deleteApiFileServiceFileTypeMimeTypesById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteMimeTypeByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.mimeType.deleteApiFileServiceMimeTypesById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteProviderByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.provider.deleteApiFileServiceProvidersById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
