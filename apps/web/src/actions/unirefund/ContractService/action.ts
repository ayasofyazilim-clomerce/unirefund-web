"use server";
import type {
  GetApiContractServiceMerchantsByIdContractsContractHeadersData,
  GetApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  GetApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
  GetApiContractServiceRebateTableHeadersData,
  GetApiContractServiceRefundFeeHeadersAssignablesByRefundPointData,
  GetApiContractServiceRefundFeeHeadersByIdData,
  GetApiContractServiceRefundFeeHeadersData,
  GetApiContractServiceRefundPointsByIdContractsContractHeadersData,
  GetApiContractServiceRefundTableHeadersAssignablesByMerchantData,
  GetApiContractServiceRefundTableHeadersByIdData,
  GetApiContractServiceRefundTableHeadersData,
  PostApiContractServiceMerchantsByIdContractsContractHeadersData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  PutApiContractServiceMerchantsContractsContractHeadersByIdSetDefaultSettingData,
  PutApiContractServiceMerchantsContractsContractSettingsByIdData,
} from "@ayasofyazilim/saas/ContractService";
import {
  getContractServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function getMerchantContractHeadersByMerchantIdApi(
  data: GetApiContractServiceMerchantsByIdContractsContractHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    const dataResponse =
      await client.contractsMerchant.getApiContractServiceMerchantsByIdContractsContractHeaders(
        data,
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postMerchantContractHeadersByMerchantIdApi(
  data: PostApiContractServiceMerchantsByIdContractsContractHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.contractsMerchant.postApiContractServiceMerchantsByIdContractsContractHeaders(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantContractHeadersContractStoresByHeaderIdApi(
  data: GetApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdContractStores(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantContractHeaderByIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersById(
        { id },
      );
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
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdContractSettings(
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
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdContractSettings(
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
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.putApiContractServiceMerchantsContractsContractSettingsById(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteMerchantContractContractSettingsByIdApi(
  id: string,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.deleteApiContractServiceMerchantsContractsContractSettingsById(
        { id },
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantContractContractHeaderSetDefaultContractSettingByHeaderIdApi(
  data: PutApiContractServiceMerchantsContractsContractHeadersByIdSetDefaultSettingData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.putApiContractServiceMerchantsContractsContractHeadersByIdSetDefaultSetting(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRefundTableHeadersApi(
  data: GetApiContractServiceRefundTableHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.refundTableHeader.getApiContractServiceRefundTableHeaders(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundTableHeadersByIdApi(
  data: GetApiContractServiceRefundTableHeadersByIdData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.refundTableHeader.getApiContractServiceRefundTableHeadersById(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundTableHeadersAssignablesByMerchantIdApi(
  data: GetApiContractServiceRefundTableHeadersAssignablesByMerchantData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.refundTableHeader.getApiContractServiceRefundTableHeadersAssignablesByMerchant(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundFeeHeadersApi(
  data: GetApiContractServiceRefundFeeHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.refundFeeHeader.getApiContractServiceRefundFeeHeaders(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundFeeHeadersByIdApi(
  data: GetApiContractServiceRefundFeeHeadersByIdData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.refundFeeHeader.getApiContractServiceRefundFeeHeadersById(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundFeeHeadersAssignablesByRefundPointIdApi(
  data: GetApiContractServiceRefundFeeHeadersAssignablesByRefundPointData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.refundFeeHeader.getApiContractServiceRefundFeeHeadersAssignablesByRefundPoint(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRebateTableHeadersApi(
  data: GetApiContractServiceRebateTableHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.rebateTableHeader.getApiContractServiceRebateTableHeaders(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRebateTableHeadersByIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.rebateTableHeader.getApiContractServiceRebateTableHeadersById(
        { id },
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRefundPointContractHeadersByRefundPointIdApi(
  data: GetApiContractServiceRefundPointsByIdContractsContractHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsRefundPoint.getApiContractServiceRefundPointsByIdContractsContractHeaders(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRefundPointContractHeaderByIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsRefundPoint.getApiContractServiceRefundPointsContractsContractHeadersById(
        { id },
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
