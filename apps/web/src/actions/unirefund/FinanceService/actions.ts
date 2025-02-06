"use server";
import type {
  GetApiFinanceServiceRebateStatementHeadersData,
  GetApiFinanceServiceVatStatementHeadersData,
} from "@ayasofyazilim/saas/FinanceService";
import type {Session} from "@repo/utils/auth";
import {getFinanceServiceClient, structuredError, structuredSuccessResponse} from "src/lib";

export async function getVatStatementHeadersApi(
  data: GetApiFinanceServiceVatStatementHeadersData,
  session?: Session | null,
) {
  try {
    const client = await getFinanceServiceClient(session);
    const dataResponse = await client.vatStatementHeader.getApiFinanceServiceVatStatementHeaders(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getVatStatementHeadersByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getFinanceServiceClient(session);
    const dataResponse = await client.vatStatementHeader.getApiFinanceServiceVatStatementHeadersById({id});
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getRebateStatementHeadersApi(
  data: GetApiFinanceServiceRebateStatementHeadersData,
  session?: Session | null,
) {
  try {
    const client = await getFinanceServiceClient(session);
    const dataResponse = await client.rebateStatementHeader.getApiFinanceServiceRebateStatementHeaders(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getRebateStatementHeadersByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getFinanceServiceClient(session);
    const dataResponse = await client.rebateStatementHeader.getApiFinanceServiceRebateStatementHeadersById({id});
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
