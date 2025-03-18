"use server";
import type {
  PutApiTravellerServiceTravellersByIdUpdatePersonalIdentificationData,
  PutApiTravellerServiceTravellersByIdUpsertPersonalPreferenceData,
  PutApiTravellerServiceTravellersByIdUpsertPersonalSummaryData,
} from "@ayasofyazilim/saas/TravellerService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getTravellersServiceClient} from "../lib";

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
