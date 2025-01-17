"use server";
import type {
  PutApiContractServiceMerchantsContractsContractHeadersByIdData,
  PutApiContractServiceRebateTablesRebateTableHeadersByIdData,
  PutApiContractServiceRefundPointsContractsContractHeadersByIdData,
  PutApiContractServiceRefundTablesRefundFeeHeadersByIdData,
  PutApiContractServiceRefundTablesRefundTableHeadersByIdData,
} from "@ayasofyazilim/saas/ContractService";
import {
  getContractServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function putRebateTableHeadersApi(
  data: PutApiContractServiceRebateTablesRebateTableHeadersByIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.templates.putRebateTableHeaders(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putRefundTableHeadersApi(
  data: PutApiContractServiceRefundTablesRefundTableHeadersByIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.templates.putRefundTableHeaders(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundFeeHeadersApi(
  data: PutApiContractServiceRefundTablesRefundFeeHeadersByIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.templates.putRefundFeeHeadersApi(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putMerchantContractHeadersByIdApi(
  data: PutApiContractServiceMerchantsContractsContractHeadersByIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.putContractHeadersById(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putRefundPointContractHeadersById(
  data: PutApiContractServiceRefundPointsContractsContractHeadersByIdData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests["refund-points"].putContractHeadersById(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function putMerchantsContractHeadersByIdMakePassiveApi(
  id: string,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.contractsMerchant.putApiContractServiceMerchantsContractsContractHeadersByIdMakePassive(
        { id },
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putRefundPointContractHeadersByIdMakePassiveApis(
  id: string,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.contractsRefundPoint.putApiContractServiceRefundPointsContractsContractHeadersByIdMakePassive(
        { id },
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
