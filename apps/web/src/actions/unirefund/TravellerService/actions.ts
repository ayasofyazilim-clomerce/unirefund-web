"use server";

import type { GetApiTravellerServiceTravellersData } from "@ayasofyazilim/saas/TravellerService";
import {
  getTravellersServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function getTravellersApi(
  data: GetApiTravellerServiceTravellersData,
) {
  try {
    const client = await getTravellersServiceClient();
    const response =
      await client.traveller.getApiTravellerServiceTravellers(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getTravellersDetailsApi(id: string) {
  try {
    const client = await getTravellersServiceClient();
    const response =
      await client.traveller.getApiTravellerServiceTravellersById({ id });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
