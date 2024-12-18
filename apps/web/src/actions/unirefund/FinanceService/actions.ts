"use server";
import type {
  GetApiFinanceServiceVatStatementHeadersData,
  GetApiFinanceServiceVatStatementHeadersFormDraftByMerchantIdData,
} from "@ayasofyazilim/saas/FinanceService";
import {
  getFinanceServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function getVatStatementHeadersApi(
  data: GetApiFinanceServiceVatStatementHeadersData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.vatStatementHeader.getApiFinanceServiceVatStatementHeaders(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getVatStatementHeadersDetailApi(id: string) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.vatStatementHeader.getApiFinanceServiceVatStatementHeadersById(
        { id },
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getVatStatementHeadersFormDraftApi(
  data: GetApiFinanceServiceVatStatementHeadersFormDraftByMerchantIdData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.vatStatementHeader.getApiFinanceServiceVatStatementHeadersFormDraftByMerchantId(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
