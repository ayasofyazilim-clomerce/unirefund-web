"use server";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getContractServiceClient} from "../lib";

export async function deleteMerchantContractHeaderByIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    const response = await client.contractsMerchant.deleteApiContractServiceMerchantsContractsContractHeadersById({id});
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteMerchantContractContractSettingsByIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.deleteApiContractServiceMerchantsContractsContractSettingsById({id}),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteRefundPointContractHeadersById(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsRefundPoint.deleteApiContractServiceRefundPointsContractsContractHeadersById({id}),
    );
  } catch (error) {
    return structuredError(error);
  }
}
