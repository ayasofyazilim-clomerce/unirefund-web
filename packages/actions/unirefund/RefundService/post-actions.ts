"use server";
import type {
  PostApiRefundServiceRefundsData,
  UniRefund_RefundService_Refunds_CreateRefundDto,
} from "@repo/saas/RefundService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getRefundServiceClient} from "../lib";

export async function postRefundApi(data: UniRefund_RefundService_Refunds_CreateRefundDto) {
  try {
    const client = await getRefundServiceClient();
    const response = await client.refund.postApiRefundServiceRefunds({requestBody: data});
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
