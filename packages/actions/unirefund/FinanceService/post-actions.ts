"use server";
import type {
  PostApiFinanceServiceRebateStatementHeadersData,
  PostApiFinanceServiceRebateStatementHeadersFormDraftData,
  PostApiFinanceServiceVatStatementHeadersData,
  PostApiFinanceServiceVatStatementHeadersFormDraftData,
} from "@repo/saas/FinanceService";
import { structuredError, structuredResponse } from "@repo/utils/api";
import { getFinanceServiceClient } from "../lib";

export async function postVatStatementHeadersFormDraftApi(data: PostApiFinanceServiceVatStatementHeadersFormDraftData) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse = await client.vatStatementHeader.postApiFinanceServiceVatStatementHeadersFormDraft(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postVatStatementHeaderApi(data: PostApiFinanceServiceVatStatementHeadersData) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse = await client.vatStatementHeader.postApiFinanceServiceVatStatementHeaders(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postRebateStatementHeadersFormDraftApi(
  data: PostApiFinanceServiceRebateStatementHeadersFormDraftData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse = await client.rebateStatementHeader.postApiFinanceServiceRebateStatementHeadersFormDraft(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postRebateStatementHeadersApi(data: PostApiFinanceServiceRebateStatementHeadersData) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse = await client.rebateStatementHeader.postApiFinanceServiceRebateStatementHeaders(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
