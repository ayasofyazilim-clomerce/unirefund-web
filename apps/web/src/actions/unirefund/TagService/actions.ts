"use server";
import type {
  GetApiTagServiceTagByIdDetailData,
  GetApiTagServiceTagData,
  GetApiTagServiceTagSummaryData,
  GetApiTagServiceTagTagsRefundData,
} from "@ayasofyazilim/saas/TagService";
import {
  getTagServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function getTagsApi(data: GetApiTagServiceTagData = {}) {
  try {
    const requests = await getApiRequests();
    const response = await requests.tags.get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTagSummaryApi(
  data: GetApiTagServiceTagSummaryData = {},
) {
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTagSummary(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTagByIdApi(data: GetApiTagServiceTagByIdDetailData) {
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTagByIdDetail(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRefundableTagsApi(
  data: GetApiTagServiceTagTagsRefundData,
) {
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTagTagsRefund(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
