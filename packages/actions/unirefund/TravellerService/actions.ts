"use server";

import type {GetApiTravellerServiceTravellersData} from "@ayasofyazilim/saas/TravellerService";
import {structuredError, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getTravellersServiceClient} from "../lib";

export async function getTravellersDetailsApi(id: string, session?: Session | null) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.traveller.getApiTravellerServiceTravellersById({id});
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
