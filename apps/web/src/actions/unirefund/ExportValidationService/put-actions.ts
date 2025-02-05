"use server";
import type {PutApiExportValidationServiceExportValidationByIdData} from "@ayasofyazilim/saas/ExportValidationService";
import {getExportValidationServiceClient, structuredError, structuredResponse} from "src/lib";

export async function putExportValidationApi(data: PutApiExportValidationServiceExportValidationByIdData) {
  try {
    const client = await getExportValidationServiceClient();
    const dataResponse = await client.exportValidation.putApiExportValidationServiceExportValidationById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
