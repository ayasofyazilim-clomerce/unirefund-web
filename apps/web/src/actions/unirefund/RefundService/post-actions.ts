"use server";
import type { PostApiRefundServiceRefundsData } from "@ayasofyazilim/saas/RefundService";
import {
  getRefundServiceClient,
  structuredError,
  structuredResponse,
} from "../../../lib";

export async function postRefundApi(data: PostApiRefundServiceRefundsData) {
  try {
    const client = await getRefundServiceClient();
    const response = await client.refund.postApiRefundServiceRefunds(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
