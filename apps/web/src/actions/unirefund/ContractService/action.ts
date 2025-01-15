"use server";
import type {
  GetApiContractServiceMerchantsByIdContractsContractHeadersData,
  GetApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  GetApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
  GetApiContractServiceRebateTablesRebateTableHeadersTemplatesData,
  GetApiContractServiceRefundPointsByIdContractsContractHeadersData,
  GetApiContractServiceRefundTablesRefundFeeHeadersByIdData,
  GetApiContractServiceRefundTablesRefundFeeHeadersData,
  GetApiContractServiceRefundTablesRefundTableHeadersByIdData,
  GetApiContractServiceRefundTablesRefundTableHeadersData,
  PostApiContractServiceMerchantsByIdContractsContractHeadersData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
  PutApiContractServiceMerchantsContractsContractHeadersByIdSetDefaultSettingData,
  PutApiContractServiceMerchantsContractsContractSettingsByIdData,
} from "@ayasofyazilim/saas/ContractService";
import {
  getContractServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function getMerchantContractHeadersByMerchantIdApi(
  data: GetApiContractServiceMerchantsByIdContractsContractHeadersData,
) {
  try {
    const requests = await getApiRequests();
    const dataResponse =
      await requests.merchants.getContractHeadersByMerchantId(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantContractHeaderIsValidatableByIdApi(
  id: string,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdIsValidatable(
        { id },
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMerchantContractHeadersByMerchantIdApi(
  data: PostApiContractServiceMerchantsByIdContractsContractHeadersData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.postContractHeadersById(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantContractHeadersContractStoresByHeaderIdApi(
  data: GetApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
) {
  try {
    const requests = await getApiRequests();
    const response =
      await requests.merchants.getContractHeadersContractStoresByHeaderId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMerchantContractHeadersContractStoresByHeaderIdApi(
  data: PostApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
) {
  try {
    const requests = await getApiRequests();
    const response =
      await requests.merchants.postContractHeadersContractStoresByHeaderId(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantContractHeaderByIdApi(id: string) {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.getContractHeaderById(id);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantContractHeaderRebateSettingsByHeaderIdApi(
  id: string,
) {
  try {
    const requests = await getContractServiceClient();
    return structuredResponse(
      await requests.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdRebateSettings(
        {
          id,
        },
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantContractHeaderContractSettingsByHeaderIdApi(
  data: GetApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.merchants.getContractHeaderContractSettingsByHeaderId(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMerchantContractHeaderContractSettingsByHeaderIdApi(
  data: PostApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.merchants.postContractHeaderContractSettingsByHeaderId(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantContractContractSettingsByIdApi(
  data: PutApiContractServiceMerchantsContractsContractSettingsByIdData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.merchants.putContractSettingsById(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteMerchantContractContractSettingsByIdApi(
  id: string,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.merchants.deleteContractSettingsById(id),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantContractContractHeaderSetDefaultContractSettingByHeaderIdApi(
  data: PutApiContractServiceMerchantsContractsContractHeadersByIdSetDefaultSettingData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.merchants.putContractHeaderSetDefaultContractSettingByHeaderId(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRefundTableHeadersApi(
  data: GetApiContractServiceRefundTablesRefundTableHeadersData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.templates.getRefundTableHeaders(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundTableHeadersById(
  data: GetApiContractServiceRefundTablesRefundTableHeadersByIdData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.templates.getRefundTableHeadersById(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundFeeHeadersApi(
  data: GetApiContractServiceRefundTablesRefundFeeHeadersData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.templates.getRefundFeeHeaders(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundFeeHeadersByIdApi(
  data: GetApiContractServiceRefundTablesRefundFeeHeadersByIdData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.templates.getRefundFeeHeadersById(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRebateTableHeadersApi(
  data: GetApiContractServiceRebateTablesRebateTableHeadersTemplatesData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.templates.getRebateTableHeaders(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRebateTableHeadersByIdApi(id: string) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests.templates.getRebateTableHeadersById(id),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRefundPointContractHeadersByRefundPointIdApi(
  data: GetApiContractServiceRefundPointsByIdContractsContractHeadersData,
) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests["refund-points"].getContractHeadersByRefundPointId(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundPointContractHeaderIsValidatableByIdApi(
  id: string,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsRefundPoint.getApiContractServiceRefundPointsContractsContractHeadersByIdIsValidatable(
        { id },
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundPointContractHeaderById(id: string) {
  try {
    const requests = await getApiRequests();
    return structuredResponse(
      await requests["refund-points"].getContractHeaderById(id),
    );
  } catch (error) {
    return structuredError(error);
  }
}
