"use server";
import type {
  GetApiFinanceServiceRebateStatementHeadersData,
  GetApiFinanceServiceVatStatementHeadersData,
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

export async function getVatStatementHeadersByIdApi(id: string) {
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

export async function getRebateStatementHeadersApi(
  data: GetApiFinanceServiceRebateStatementHeadersData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.rebateStatementHeader.getApiFinanceServiceRebateStatementHeaders(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRebateStatementHeadersByIdApi(id: string) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.rebateStatementHeader.getApiFinanceServiceRebateStatementHeadersById(
        { id },
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
