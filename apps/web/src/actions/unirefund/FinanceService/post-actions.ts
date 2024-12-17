"use server";
import type { PostApiFinanceServiceVatStatementHeadersData } from "@ayasofyazilim/saas/FinanceService";
import {
  getFinanceServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function postVatStatementHeadersApi(
  data: PostApiFinanceServiceVatStatementHeadersData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.vatStatementHeader.postApiFinanceServiceVatStatementHeaders(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
