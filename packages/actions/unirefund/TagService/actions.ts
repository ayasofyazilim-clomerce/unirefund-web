"use server";
import type {
  GetApiTagServiceTagByIdDetailData,
  GetApiTagServiceTagData,
  GetApiTagServiceTagSummaryData,
  GetApiTagServiceTagTagsRefundData,
} from "@ayasofyazilim/saas/TagService";
import {structuredResponse, structuredError, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getTagServiceClient} from "../lib";

export async function getTagsApi(data: GetApiTagServiceTagData = {}, session?: Session | null) {
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags", "TagService.Tags.View"],
    lang: "en",
  });
  try {
    const client = await getTagServiceClient(session);
    const response = await client.tag.getApiTagServiceTag(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTagSummaryApi(data: GetApiTagServiceTagSummaryData = {}) {
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags", "TagService.Tags.View", "TagService.Tags.ViewSummary"],
    lang: "en",
  });
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTagSummary(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTagByIdApi(data: GetApiTagServiceTagByIdDetailData) {
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags.Detail", "TagService.Tags.View"],
    lang: "en",
  });
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTagByIdDetail(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getRefundableTagsApi(data: GetApiTagServiceTagTagsRefundData) {
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags", "TagService.Tags.ViewForRefund", "TagService.Tags.View"],
    lang: "en",
  });
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTagTagsRefund(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
