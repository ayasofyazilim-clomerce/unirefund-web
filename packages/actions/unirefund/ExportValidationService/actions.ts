"use server";
import type {GetApiExportValidationServiceExportValidationData} from "@ayasofyazilim/saas/ExportValidationService";
import {structuredResponse, structuredError} from "@repo/utils/api";
import {getExportValidationServiceClient} from "../lib";

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
