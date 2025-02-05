"use server";
import type {GetApiRefundServiceRefundsData} from "@ayasofyazilim/saas/RefundService";
import {getRefundServiceClient, structuredError, structuredResponse} from "src/lib";

export async function getRefundApi(data: GetApiRefundServiceRefundsData = {}) {
  try {
    const client = await getRefundServiceClient();
    const response = await client.refund.getApiRefundServiceRefunds(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundDetailByIdApi(id: string) {
  try {
    const client = await getRefundServiceClient();
    const response = await client.refund.getApiRefundServiceRefundsByIdDetail({
      id,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
