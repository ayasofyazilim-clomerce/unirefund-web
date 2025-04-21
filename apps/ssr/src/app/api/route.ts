"use server";
import {AccountServiceClient} from "@ayasofyazilim/core-saas/AccountService";

const appClient = new AccountServiceClient({
  BASE: process.env.BASE_URL,
});

export async function GET(request: Request) {
  // get search params from request
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") || "en";
  // Use the client instance to make the API call
  const response = await appClient.abpApplicationLocalization.getApiAbpApplicationLocalization({cultureName: lang});
  return new Response(JSON.stringify(response));
}
