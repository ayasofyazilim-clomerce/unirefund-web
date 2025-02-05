"use server";

import {getAccountServiceClient, structuredError, structuredResponse} from "src/lib";

export async function deleteSessionsByIdApi(id: string) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.sessions.deleteApiAccountSessionsById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
