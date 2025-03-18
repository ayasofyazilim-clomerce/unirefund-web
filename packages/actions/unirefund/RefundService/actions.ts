"use server";
import type {GetApiRefundServiceRefundsData} from "@ayasofyazilim/saas/RefundService";
import {structuredSuccessResponse, structuredError} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getRefundServiceClient} from "../lib";

export async function getRefundApi(data: GetApiRefundServiceRefundsData = {}, session?: Session | null) {
  await isUnauthorized({
    requiredPolicies: ["RefundService.Refunds", "RefundService.Refunds.View"],
    lang: "en",
  });
  try {
    const client = await getRefundServiceClient(session);
    const response = await client.refund.getApiRefundServiceRefunds(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundDetailByIdApi(id: string, session?: Session | null) {
  await isUnauthorized({
    requiredPolicies: ["RefundService.Refunds.Detail", "RefundService.Refunds.View"],
    lang: "en",
  });
  try {
    const client = await getRefundServiceClient(session);
    const response = await client.refund.getApiRefundServiceRefundsByIdDetail({id});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
