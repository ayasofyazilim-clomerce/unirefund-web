"use server";
import type {
  PutApiTravellerServiceEvidenceSessionByIdData,
  PutApiTravellerServiceTravellersByIdUpdatePersonalIdentificationData,
  PutApiTravellerServiceTravellersByIdUpsertPersonalPreferenceData,
  PutApiTravellerServiceTravellersByIdUpsertPersonalSummaryData,
} from "@ayasofyazilim/saas/TravellerService";
import {structuredError, structuredResponse, structuredSuccessResponse} from "@repo/utils/api";
import {getTravellersServiceClient} from "../lib";
import {Session} from "@repo/utils/auth";

export async function putTravellerPersonalIdentificationApi(
  data: PutApiTravellerServiceTravellersByIdUpdatePersonalIdentificationData,
) {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.traveller.putApiTravellerServiceTravellersByIdUpdatePersonalIdentification(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putTravellerPersonalPreferenceApi(
  data: PutApiTravellerServiceTravellersByIdUpsertPersonalPreferenceData,
) {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.traveller.putApiTravellerServiceTravellersByIdUpsertPersonalPreference(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putTravellerPersonalSummaryApi(
  data: PutApiTravellerServiceTravellersByIdUpsertPersonalSummaryData,
) {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.traveller.putApiTravellerServiceTravellersByIdUpsertPersonalSummary(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putApiTravellerServiceEvidenceSessionById(
  data: PutApiTravellerServiceEvidenceSessionByIdData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.evidenceSession.putApiTravellerServiceEvidenceSessionById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
