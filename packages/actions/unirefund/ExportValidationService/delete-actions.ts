"use server";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getExportValidationServiceClient} from "../lib";

export async function deleteExportValidationByIdApi(id: string) {
  try {
    const client = await getExportValidationServiceClient();
    const dataResponse = await client.exportValidation.deleteApiExportValidationServiceExportValidationById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
