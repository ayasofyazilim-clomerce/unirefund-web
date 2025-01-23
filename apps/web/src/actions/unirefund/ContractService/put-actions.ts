"use server";
import type {
  PutApiContractServiceMerchantsContractsContractHeadersByIdData,
  PutApiContractServiceRebateTableHeadersByIdData,
  PutApiContractServiceRefundFeeHeadersByIdData,
  PutApiContractServiceRefundPointsContractsContractHeadersByIdData,
  PutApiContractServiceRefundTableHeadersByIdData,
} from "@ayasofyazilim/saas/ContractService";
import {
  getContractServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

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

export async function putRefundTableHeadersByIdApi(
  data: PutApiContractServiceRefundTableHeadersByIdData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.refundTableHeader.putApiContractServiceRefundTableHeadersById(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putRefundFeeHeadersByIdApi(
  data: PutApiContractServiceRefundFeeHeadersByIdData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.refundFeeHeader.putApiContractServiceRefundFeeHeadersById(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRebateTableHeadersByIdApi(
  data: PutApiContractServiceRebateTableHeadersByIdData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.rebateTableHeader.putApiContractServiceRebateTableHeadersById(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
