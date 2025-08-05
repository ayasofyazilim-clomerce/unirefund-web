"use server";
import type {
  PostApiTravellerServiceEvidenceSessionsAnalyzeDocumentByMrzData,
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

export async function postCreateEvidenceSessionPublic(
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
  data: PostApiTravellerServiceEvidenceSessionsAnalyzeDocumentByMrzData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.evidenceSession.postApiTravellerServiceEvidenceSessionsAnalyzeDocumentByMrz(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postApiTravellerServiceEvidenceSessionPublicAnalyzeDocumentByMrz(
  data: PostApiTravellerServicePublicEvidenceSessionsAnalyzeDocumentByMrzData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response =
      await client.evidenceSessionPublic.postApiTravellerServicePublicEvidenceSessionsAnalyzeDocumentByMrz(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    console.error("Error in postApiTravellerServiceEvidenceSessionAnalyzeDocumentByMrz:", error);

    return structuredError(error);
  }
}

export async function postApiTravellerServiceEvidenceSessionPublicValidateNfc(
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
