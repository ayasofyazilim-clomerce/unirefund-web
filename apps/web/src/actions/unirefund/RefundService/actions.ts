"use server";
import type {GetApiRefundServiceRefundsData} from "@ayasofyazilim/saas/RefundService";
import type {Session} from "@repo/utils/auth";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getRefundServiceClient} from "@/lib";

export async function getRefundApi(data: GetApiRefundServiceRefundsData = {}) {
  try {
    const client = await getRefundServiceClient();
    const response = await client.refund.getApiRefundServiceRefunds(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundDetailByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getRefundServiceClient(session);
    const response = await client.refund.getApiRefundServiceRefundsByIdDetail({
      id,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
