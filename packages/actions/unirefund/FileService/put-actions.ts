"use server";

import {
  PutApiFileServiceFileRelationEntitiesByIdData,
  PutApiFileServiceFileRelationsByIdData,
  PutApiFileServiceFilesByIdMetaData,
  PutApiFileServiceFilesByIdValidateOrInvalidateData,
  PutApiFileServiceFileTypeGroupsByIdData,
  PutApiFileServiceFileTypeMimeTypesByIdData,
  PutApiFileServiceFileTypesByIdData,
  PutApiFileServiceMimeTypesByIdData,
  PutApiFileServiceProvidersByIdData,
} from "@ayasofyazilim/saas/FileService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {Session} from "@repo/utils/auth";
import {getFileServiceClient} from "../lib";

export async function putFileValidationByIdApi(
  data: PutApiFileServiceFilesByIdValidateOrInvalidateData,
  session?: Session | null,
) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.file.putApiFileServiceFilesByIdValidateOrInvalidate(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putFileMetaByIdApi(data: PutApiFileServiceFilesByIdMetaData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.file.putApiFileServiceFilesByIdMeta(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putFileValidateOrInvalidateApi(
  data: PutApiFileServiceFilesByIdValidateOrInvalidateData,
  session?: Session | null,
) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.file.putApiFileServiceFilesByIdValidateOrInvalidate(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putFileRelationsByIdApi(data: PutApiFileServiceFileRelationsByIdData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileRelation.putApiFileServiceFileRelationsById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putFileRelationEntitiesApi(
  data: PutApiFileServiceFileRelationEntitiesByIdData,
  session?: Session | null,
) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileRelationEntity.putApiFileServiceFileRelationEntitiesById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putFileTypesApi(data: PutApiFileServiceFileTypesByIdData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileType.putApiFileServiceFileTypesById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putFileTypeGroupsByIdApi(
  data: PutApiFileServiceFileTypeGroupsByIdData,
  session?: Session | null,
) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileTypeGroup.putApiFileServiceFileTypeGroupsById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putFileTypeMimeTypesApi(
  data: PutApiFileServiceFileTypeMimeTypesByIdData,
  session?: Session | null,
) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.fileTypeMimeType.putApiFileServiceFileTypeMimeTypesById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMimeTypeApi(data: PutApiFileServiceMimeTypesByIdData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.mimeType.putApiFileServiceMimeTypesById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putProviderApi(data: PutApiFileServiceProvidersByIdData, session?: Session | null) {
  try {
    const client = await getFileServiceClient(session);
    const dataResponse = await client.provider.putApiFileServiceProvidersById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
