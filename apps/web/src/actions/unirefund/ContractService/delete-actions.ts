"use server";
import {
  getContractServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function deleteMerchantContractHeaderByIdApi(id: string) {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.deleteContractHeadersById(id);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteRefundPointContractHeadersById(id: string) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests["refund-points"].deleteContractHeadersById(id),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteRefundFeeHeadersById(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.refundTables.deleteApiContractServiceRefundTablesRefundFeeHeadersById(
        {
          id,
        },
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteRefundTableHeadersById(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.refundTables.deleteApiContractServiceRefundTablesRefundTableHeadersById(
        {
          id,
        },
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
