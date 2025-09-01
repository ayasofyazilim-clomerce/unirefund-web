"use server";

import type {
  PostApiContractServiceMerchantsByIdContractsContractHeadersData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdRebateSettingsData,
  PostApiContractServiceRebateTableHeadersCloneByIdData,
  PostApiContractServiceRebateTableHeadersData,
  PostApiContractServiceRefundFeeHeadersCloneByIdData,
  PostApiContractServiceRefundFeeHeadersData,
  PostApiContractServiceRefundPointsByIdContractsContractHeadersData,
  PostApiContractServiceRefundTableHeadersCloneByIdData,
  PostApiContractServiceRefundTableHeadersData,
} from "@ayasofyazilim/saas/ContractService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getContractServiceClient} from "../lib";

export async function postRefundTableHeadersApi(data: PostApiContractServiceRefundTableHeadersData) {
  try {
    const client = await getContractServiceClient();
    const response = await client.refundTableHeader.postApiContractServiceRefundTableHeaders(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postRefundTableHeaderCloneByIdApi(data: PostApiContractServiceRefundTableHeadersCloneByIdData) {
  try {
    const client = await getContractServiceClient();
    const response = await client.refundTableHeader.postApiContractServiceRefundTableHeadersCloneById(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postRebateTableHeadersApi(data: PostApiContractServiceRebateTableHeadersData) {
  try {
    const client = await getContractServiceClient();
    const response = await client.rebateTableHeader.postApiContractServiceRebateTableHeaders(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postRebateTableHeaderCloneByIdApi(data: PostApiContractServiceRebateTableHeadersCloneByIdData) {
  try {
    const client = await getContractServiceClient();
    const response = await client.rebateTableHeader.postApiContractServiceRebateTableHeadersCloneById(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postRefundFeeHeadersApi(data: PostApiContractServiceRefundFeeHeadersData) {
  try {
    const client = await getContractServiceClient();
    const response = await client.refundFeeHeader.postApiContractServiceRefundFeeHeaders(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postRefundFeeHeaderCloneByIdApi(data: PostApiContractServiceRefundFeeHeadersCloneByIdData) {
  try {
    const client = await getContractServiceClient();
    const response = await client.refundFeeHeader.postApiContractServiceRefundFeeHeadersCloneById(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postMerchantContractHeaderRebateSettingByHeaderIdApi(
  data: PostApiContractServiceMerchantsContractsContractHeadersByIdRebateSettingsData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdRebateSettings(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function postMerchantContractHeaderValidateByHeaderIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdValidate({id}),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function postMerchantContractHeadersByMerchantIdApi(
  data: PostApiContractServiceMerchantsByIdContractsContractHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.postApiContractServiceMerchantsByIdContractsContractHeaders(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function postMerchantContractHeaderContractStoresByHeaderIdApi(
  data: PostApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdContractStores(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMerchantContractHeadersContractStoresByHeaderIdApi(
  data: PostApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdContractStores(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMerchantContractHeaderContractSettingsByHeaderIdApi(
  data: PostApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdContractSettings(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postRefundPointContractHeadersByIdApi(
  data: PostApiContractServiceRefundPointsByIdContractsContractHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsRefundPoint.postApiContractServiceRefundPointsByIdContractsContractHeaders(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function postRefundPointContractHeaderValidateByHeaderIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsRefundPoint.postApiContractServiceRefundPointsContractsContractHeadersByIdValidate({id}),
    );
  } catch (error) {
    return structuredError(error);
  }
}
