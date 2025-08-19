"use server";

import {
  PutApiTravellerServiceEvidenceSessionsByIdData,
  PutApiTravellerServiceTravellersByIdUpdateTravellerDocumentData,
} from "@ayasofyazilim/saas/TravellerService";
import {structuredError, structuredSuccessResponse} from "@repo/utils/api";
import {Session} from "@repo/utils/auth";
import {getTravellersServiceClient} from "../lib";

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

export async function putTravellerDocumentApi(
  data: PutApiTravellerServiceTravellersByIdUpdateTravellerDocumentData,
  session?: Session | null,
) {
  try {
    const client = await getTravellersServiceClient(session);
    const response = await client.traveller.putApiTravellerServiceTravellersByIdUpdateTravellerDocument(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
