"use server";

import type {
  PostApiAccountMyProfileChangePasswordData,
  PostApiAccountProfilePictureData,
  PostApiAccountSendPasswordResetCodeData,
} from "@ayasofyazilim/core-saas/AccountService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getAccountServiceClient} from "../lib";

export async function postPasswordChangeApi(data: PostApiAccountMyProfileChangePasswordData) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.profile.postApiAccountMyProfileChangePassword(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postProfilePictureApi(data: PostApiAccountProfilePictureData) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.account.postApiAccountProfilePicture(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postSendPasswordResetCodeApi(data: PostApiAccountSendPasswordResetCodeData) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.account.postApiAccountSendPasswordResetCode(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
