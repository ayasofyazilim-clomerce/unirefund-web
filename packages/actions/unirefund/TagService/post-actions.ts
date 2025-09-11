"use server";
import type { PostApiTagServiceTagData } from "@repo/saas/TagService";
import { structuredError, structuredResponse } from "@repo/utils/api";
import { getTagServiceClient } from "../lib";

export async function postTagApi(data: PostApiTagServiceTagData) {
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.postApiTagServiceTag(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
