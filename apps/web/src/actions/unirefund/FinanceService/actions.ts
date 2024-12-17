"use server";
import type {
  GetApiFinanceServiceVatStatementHeadersByIdData,
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

export async function getVatStatementHeadersDetailApi(
  data: GetApiFinanceServiceVatStatementHeadersByIdData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.vatStatementHeader.getApiFinanceServiceVatStatementHeadersById(
        data,
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
