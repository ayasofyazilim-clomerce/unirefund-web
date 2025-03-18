"use server";
import type {PutApiTagServiceTagExportValidationByIdData} from "@ayasofyazilim/saas/TagService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getTagServiceClient} from "../lib";

export async function putExportValidationByIdApi(data: PutApiTagServiceTagExportValidationByIdData) {
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.putApiTagServiceTagExportValidationById(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
