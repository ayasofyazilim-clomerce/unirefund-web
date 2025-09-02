"use server";
import type { PostApiRefundServiceRefundsData } from "@repo/saas/RefundService";
import { structuredError, structuredResponse } from "@repo/utils/api";
import { getRefundServiceClient } from "../lib";

export async function postRefundApi(data: PostApiRefundServiceRefundsData) {
  try {
    const client = await getRefundServiceClient();
    const response = await client.refund.postApiRefundServiceRefunds(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
