"use server";
import type {
  PostApiTravellerServicePublicEvidenceSessionsAnalyzeDocumentByMrzData,
  PostApiTravellerServicePublicEvidenceSessionsData,
  PostApiTravellerServicePublicEvidenceSessionsLivenessCompareFacesData,
  PostApiTravellerServicePublicEvidenceSessionsValidateNfcData,
  PostApiTravellerServiceTravellersByIdCreateTravellerDocumentData,
  PostApiTravellerServiceTravellersData,
} from "@ayasofyazilim/saas/TravellerService";
import {structuredError, structuredResponse, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getTravellersServiceClient} from "../lib";

export async function postTravellerApi(data: PostApiTravellerServiceTravellersData) {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.traveller.postApiTravellerServiceTravellers(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postTravellerDocumentApi(data: PostApiTravellerServiceTravellersByIdCreateTravellerDocumentData) {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.traveller.postApiTravellerServiceTravellersByIdCreateTravellerDocument(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postCreateEvidenceSession(
  data: PostApiTravellerServicePublicEvidenceSessionsData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.evidenceSessionPublic.postApiTravellerServicePublicEvidenceSessions(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postApiTravellerServiceEvidenceSessionAnalyzeDocumentByMrz(
  data: PostApiTravellerServicePublicEvidenceSessionsAnalyzeDocumentByMrzData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response =
      await client.evidenceSessionPublic.postApiTravellerServicePublicEvidenceSessionsAnalyzeDocumentByMrz(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postApiTravellerServiceEvidenceSessionValidateNfc(
  data: PostApiTravellerServicePublicEvidenceSessionsValidateNfcData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.evidenceSessionPublic.postApiTravellerServicePublicEvidenceSessionsValidateNfc(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postApiEvidenceSessionLivenessCompareFaces(
  data: PostApiTravellerServicePublicEvidenceSessionsLivenessCompareFacesData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response =
      await client.evidenceSessionPublic.postApiTravellerServicePublicEvidenceSessionsLivenessCompareFaces(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
