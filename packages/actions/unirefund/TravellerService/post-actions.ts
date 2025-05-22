"use server";
import type {
  PostApiTravellerServiceRekognitionCompareFacesData,
  PostApiTravellerServiceTravellersByIdCreatePersonalIdentificationData,
  PostApiTravellerServiceTravellersData,
} from "@ayasofyazilim/saas/TravellerService";
import { structuredError, structuredResponse } from "@repo/utils/api";
import { getTravellersServiceClient } from "../lib";

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

export async function postCompareFaces(data: PostApiTravellerServiceRekognitionCompareFacesData) {
  try {
    const client = await getTravellersServiceClient();
    const response = await client.rekognition.postApiTravellerServiceRekognitionCompareFaces(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}