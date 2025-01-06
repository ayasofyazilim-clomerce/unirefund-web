"use server";
import type {
  PostApiFinanceServiceRebateStatementHeadersByMerchantIdData,
  PostApiFinanceServiceRebateStatementHeadersFormDraftByMerchantIdData,
  PostApiFinanceServiceVatStatementHeadersByMerchantIdData,
  PostApiFinanceServiceVatStatementHeadersFormDraftByMerchantIdData,
} from "@ayasofyazilim/saas/FinanceService";
import {
  getFinanceServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function postVatStatementHeadersFormDraftByMerchantIdApi(
  data: PostApiFinanceServiceVatStatementHeadersFormDraftByMerchantIdData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.vatStatementHeader.postApiFinanceServiceVatStatementHeadersFormDraftByMerchantId(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postVatStatementHeadersByMerchantIdApi(
  data: PostApiFinanceServiceVatStatementHeadersByMerchantIdData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.vatStatementHeader.postApiFinanceServiceVatStatementHeadersByMerchantId(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postRebateStatementHeadersFormDraftByMerchantIdApi(
  data: PostApiFinanceServiceRebateStatementHeadersFormDraftByMerchantIdData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.rebateStatementHeader.postApiFinanceServiceRebateStatementHeadersFormDraftByMerchantId(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postRebateStatementHeadersByMerchantIdApi(
  data: PostApiFinanceServiceRebateStatementHeadersByMerchantIdData,
) {
  try {
    const client = await getFinanceServiceClient();
    const dataResponse =
      await client.rebateStatementHeader.postApiFinanceServiceRebateStatementHeadersByMerchantId(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
