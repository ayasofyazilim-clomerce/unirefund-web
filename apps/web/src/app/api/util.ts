import type {Volo_Abp_Http_RemoteServiceErrorResponse} from "@ayasofyazilim/saas/AccountService";
import {ApiError} from "@ayasofyazilim/saas/AccountService";
import type {NextRequest} from "next/server";

interface ErrorWithStatus {
  statusText: string;
  status: number;
}

function isErrorWithStatus(error: unknown): error is ErrorWithStatus {
  return typeof error === "object" && error !== null && "statusText" in error && "status" in error;
}
export interface Client {
  get: (page: number, _filter: string, ...args: unknown[]) => Promise<unknown>;
  post: (requestBody: unknown) => Promise<unknown>;
  put: ({id, requestBody}: {id: string; requestBody: unknown}) => Promise<unknown>;
  delete: (id: string, ...args: unknown[]) => Promise<unknown>;
}
export type AasyncFunction = () => Promise<Partial<Client>>;

export type Clients = Record<string, AasyncFunction>;

export const errorResponse = (message: string, status = 400) => new Response(JSON.stringify({message}), {status});

export function isApiError(error: unknown): error is ApiError {
  if ((error as ApiError).name === "ApiError") {
    return true;
  }
  return error instanceof ApiError;
}

export async function commonPOST(request: NextRequest, {params}: {params: {data: string}}, clients: Clients) {
  if (!Object.keys(clients).includes(params.data)) {
    return errorResponse("Invalid data type");
  }
  const client = await clients[params.data]();
  const requestBody: unknown = await request.json();
  if (typeof client.post !== "function")
    return errorResponse(`Request is not valid, no post function in the ${params.data} client`);
  try {
    const roles = await client.post(requestBody);
    return new Response(JSON.stringify(roles));
  } catch (error: unknown) {
    if (isApiError(error)) {
      const body = error.body as Volo_Abp_Http_RemoteServiceErrorResponse;
      return errorResponse(body.error?.message || "Something went wrong", error.status);
    }
    return errorResponse("Something went wrong");
  }
}

export async function commonGET(
  request: NextRequest,
  {params}: {params: {data: string}},
  clients: Clients,
  id?: string,
) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page"));
  const filter = searchParams.get("filter") || "";
  const maxResultCount = Number(searchParams.get("maxResultCount")) || 10;
  if (!Object.keys(clients).includes(params.data)) {
    // return status 404
    return errorResponse("Invalid data type");
  }
  const client = await clients[params.data]();
  if (typeof client.get !== "function")
    return errorResponse(`Request is not valid, no get function in the ${params.data} client`);
  try {
    if (id) {
      const data = await client.get(page, filter, id);
      return new Response(JSON.stringify(data));
    }
    if (maxResultCount) {
      const data = await client.get(page, filter, maxResultCount);
      return new Response(JSON.stringify(data));
    }
    const data = await client.get(page, filter);
    return new Response(JSON.stringify(data));
  } catch (error: unknown) {
    if (isApiError(error)) {
      const body = error.body as Volo_Abp_Http_RemoteServiceErrorResponse;
      const message = body.error?.message || error.statusText;
      return errorResponse(message, error.status);
    }
    if (isErrorWithStatus(error)) {
      const errorText = `${error.statusText} ${error.status}`;
      const errorStatus = Number(error.status);
      return errorResponse(errorText, errorStatus);
    }
    return errorResponse("unknwon error", 500);
  }
}

export async function commonDELETE(request: NextRequest, {params}: {params: {data: string}}, clients: Clients) {
  if (!Object.keys(clients).includes(params.data)) {
    return errorResponse("Invalid data type");
  }
  let retVal = "something went wrong";
  const client = await clients[params.data]();
  const id: string = (await request.json()) as string;
  if (typeof client.delete !== "function")
    return errorResponse(`Request is not valid, no delete function in the ${params.data} client`);
  const deleteById = await client.delete(id);
  if (deleteById === undefined) retVal = "successfull";
  return new Response(JSON.stringify(retVal));
}

export async function commonPUT(request: NextRequest, {params}: {params: {data: string}}, clients: Clients) {
  if (!Object.keys(clients).includes(params.data)) {
    return errorResponse("Invalid data type");
  }
  const client = await clients[params.data]();
  const requestBody: unknown = await request.json();
  if (typeof client.put !== "function")
    return errorResponse(`Request is not valid, no put function in the ${params.data} client`);
  try {
    let id: string | undefined, _requestBody: string | undefined, organizationId: string | undefined;
    if (requestBody && typeof requestBody === "object" && "id" in requestBody) {
      id = requestBody.id as string;
    }
    if (requestBody && typeof requestBody === "object" && "organizationId" in requestBody) {
      organizationId = requestBody.organizationId as string;
    }
    if (requestBody && typeof requestBody === "object" && "requestBody" in requestBody) {
      _requestBody = requestBody.requestBody as string;
    }
    if (typeof _requestBody === "object") {
      _requestBody = JSON.stringify(_requestBody);
    }
    const requestBodyObject: unknown = _requestBody === undefined ? "" : JSON.parse(_requestBody);
    const roles = await client.put({
      id: id || "",
      requestBody: organizationId || requestBodyObject,
    });
    return new Response(JSON.stringify(roles));
  } catch (error: unknown) {
    if (isApiError(error)) {
      const body = error.body as Volo_Abp_Http_RemoteServiceErrorResponse;
      return errorResponse(body.error?.message || "Uknonw error occured on the server side", error.status);
    }
    return errorResponse("Uknonw error occured on the client/server side 1");
  }
}
