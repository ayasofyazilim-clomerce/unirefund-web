"use server";

import {
  getTravellersServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function deleteTravellerPersonalIdentificationApi(id: string) {
  try {
    const client = await getTravellersServiceClient();
    const response =
      await client.traveller.deleteApiTravellerServiceTravellersByIdDeletePersonalIdentification(
        { id },
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
