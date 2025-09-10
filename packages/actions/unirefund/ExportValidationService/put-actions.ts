"use server";
import type { PutApiExportValidationServiceExportValidationByIdData } from "@repo/saas/ExportValidationService";
import { structuredError, structuredResponse } from "@repo/utils/api";
import { getExportValidationServiceClient } from "../lib";

export async function putExportValidationApi(data: PutApiExportValidationServiceExportValidationByIdData) {
  try {
    const client = await getExportValidationServiceClient();
    const dataResponse = await client.exportValidation.putApiExportValidationServiceExportValidationById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
