"use server";

import {
  PutApiTravellerServiceEvidenceSessionsByIdData,
  PutApiTravellerServiceTravellersByIdAddressesData,
  PutApiTravellerServiceTravellersByIdEmailsData,
  PutApiTravellerServiceTravellersByIdTelephonesData,
  PutApiTravellerServiceTravellersByIdTravellerDocumentData,
  PutApiTravellerServiceTravellersData,
} from "@repo/saas/TravellerService";
import { structuredError, structuredSuccessResponse } from "@repo/utils/api";
import { Session } from "@repo/utils/auth";
import { getTravellersServiceClient } from "../lib";

export async function putApiEvidenceSessionById(
  data: PutApiTravellerServiceEvidenceSessionsByIdData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.evidenceSession.putApiTravellerServiceEvidenceSessionsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putTravellerApi(
  data: PutApiTravellerServiceTravellersData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.traveller.putApiTravellerServiceTravellers(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putTravellerEmailsByTravellerIdApi(
  data: PutApiTravellerServiceTravellersByIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getTravellersServiceClient(session);
    const response = await crmClient.traveller.putApiTravellerServiceTravellersByIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTravellerTelephonesByTravellerIdApi(
  data: PutApiTravellerServiceTravellersByIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getTravellersServiceClient(session);
    const response = await crmClient.traveller.putApiTravellerServiceTravellersByIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTravellerAddressesByTravellerIdApi(
  data: PutApiTravellerServiceTravellersByIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getTravellersServiceClient(session);
    const response = await crmClient.traveller.putApiTravellerServiceTravellersByIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putTravellerDocumentApi(
  data: PutApiTravellerServiceTravellersByIdTravellerDocumentData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.traveller.putApiTravellerServiceTravellersByIdTravellerDocument(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
