"use server";
import type {
  PostApiTravellerServiceEvidenceSessionAnalyzeDocumentByMrzData,
  PostApiTravellerServiceEvidenceSessionData,
  PostApiTravellerServiceEvidenceSessionLivenessCompareFacesData,
  PostApiTravellerServiceEvidenceSessionValidateNfcData,
  PostApiTravellerServiceTravellersByIdCreatePersonalIdentificationData,
  PostApiTravellerServiceTravellersData,
} from "@ayasofyazilim/saas/TravellerService";
import {structuredError, structuredResponse, structuredSuccessResponse} from "@repo/utils/api";
import {getTravellersServiceClient} from "../lib";
import type {Session} from "@repo/utils/auth";

export async function postTravellerApi(data: PostApiTravellerServiceTravellersData) {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.traveller.postApiTravellerServiceTravellers(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postTravellerIdentificationApi(
  data: PostApiTravellerServiceTravellersByIdCreatePersonalIdentificationData,
) {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.traveller.postApiTravellerServiceTravellersByIdCreatePersonalIdentification(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postCreateEvidenceSession(
  data: PostApiTravellerServiceEvidenceSessionData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.evidenceSession.postApiTravellerServiceEvidenceSession(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function postApiTravellerServiceEvidenceSessionAnalyzeDocumentByMrz(
  data: PostApiTravellerServiceEvidenceSessionAnalyzeDocumentByMrzData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.evidenceSession.postApiTravellerServiceEvidenceSessionAnalyzeDocumentByMrz(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function postApiTravellerServiceEvidenceSessionValidateNfc(
  data: PostApiTravellerServiceEvidenceSessionValidateNfcData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.evidenceSession.postApiTravellerServiceEvidenceSessionValidateNfc(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function postApiEvidenceSessionLivenessCompareFaces(
  data: PostApiTravellerServiceEvidenceSessionLivenessCompareFacesData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.evidenceSession.postApiTravellerServiceEvidenceSessionLivenessCompareFaces(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
