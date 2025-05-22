"use server";

import type { GetApiTravellerServiceTravellersData } from "@ayasofyazilim/saas/TravellerService";
import { structuredError, structuredResponse, structuredSuccessResponse } from "@repo/utils/api";
import type { Session } from "@repo/utils/auth";
import { getTravellersServiceClient } from "../lib";

export async function getTravellersDetailsApi(id: string, session?: Session | null) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.traveller.getApiTravellerServiceTravellersById({ id });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getTravellersApi(data: GetApiTravellerServiceTravellersData, session?: Session | null) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.traveller.getApiTravellerServiceTravellers(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getCreateFaceLiveness() {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.rekognition.getApiTravellerServiceRekognitionCreateFaceLivenessSession();
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getFaceLiveness(sessionId: string) {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.rekognition.getApiTravellerServiceRekognitionGetFaceLivenessSessionResults({ sessionId });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
