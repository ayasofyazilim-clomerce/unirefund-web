"use server";
import type {GetApiExportValidationServiceExportValidationData} from "@ayasofyazilim/saas/ExportValidationService";
import {getExportValidationServiceClient, structuredError, structuredResponse} from "src/lib";

export async function getExportValidationApi(data: GetApiExportValidationServiceExportValidationData) {
  try {
    const client = await getExportValidationServiceClient();
    const dataResponse = await client.exportValidation.getApiExportValidationServiceExportValidation(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getExportValidationDetailsApi(id: string) {
  try {
    const client = await getExportValidationServiceClient();
    const dataResponse = await client.exportValidation.getApiExportValidationServiceExportValidationById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
