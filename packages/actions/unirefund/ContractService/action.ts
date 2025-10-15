"use server";
import type {
  GetApiContractServiceMerchantsByIdContractsContractHeadersData,
  GetApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  GetApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
  GetApiContractServiceRebateTableHeadersAssignablesByMerchantData,
  GetApiContractServiceRebateTableHeadersData,
  GetApiContractServiceRefundFeeHeadersAssignablesByRefundPointData,
  GetApiContractServiceRefundFeeHeadersData,
  GetApiContractServiceRefundPointsByIdContractsContractHeadersData,
  GetApiContractServiceRefundTableHeadersAssignablesByMerchantData,
  GetApiContractServiceRefundTableHeadersData,
} from "@repo/saas/ContractService";
import {structuredError, structuredResponse, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getContractServiceClient} from "../lib";

export async function getMerchantContractHeadersByMerchantIdApi(
  data: GetApiContractServiceMerchantsByIdContractsContractHeadersData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    const dataResponse =
      await client.contractsMerchant.getApiContractServiceMerchantsByIdContractsContractHeaders(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointContractHeadersByRefundPointIdApi(
  data: GetApiContractServiceRefundPointsByIdContractsContractHeadersData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    return structuredSuccessResponse(
      await client.contractsRefundPoint.getApiContractServiceRefundPointsByIdContractsContractHeaders(data),
    );
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundTableHeadersAssignablesByMerchantIdApi(
  data: GetApiContractServiceRefundTableHeadersAssignablesByMerchantData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    return structuredSuccessResponse(
      await client.refundTableHeader.getApiContractServiceRefundTableHeadersAssignablesByMerchant(data),
    );
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantContractHeadersContractStoresByHeaderIdApi(
  data: GetApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    const response =
      await client.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdContractStores(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantContractHeaderByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getContractServiceClient(session);
    const response = await client.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersById({id});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantContractHeaderContractSettingsByHeaderIdApi(
  data: GetApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    return structuredResponse(
      await client.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdContractSettings(data),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantContractHeaderRebateSettingsByHeaderIdApi(id: string, session?: Session | null) {
  try {
    const requests = await getContractServiceClient(session);
    return structuredResponse(
      await requests.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdRebateSettings({
        id,
      }),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRebateTableHeadersApi(
  data: GetApiContractServiceRebateTableHeadersData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    return structuredSuccessResponse(await client.rebateTableHeader.getApiContractServiceRebateTableHeaders(data));
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRebateTableHeadersAssignablesByMerchantIdApi(
  data: GetApiContractServiceRebateTableHeadersAssignablesByMerchantData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    return structuredSuccessResponse(
      await client.rebateTableHeader.getApiContractServiceRebateTableHeadersAssignablesByMerchant(data),
    );
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundFeeHeadersAssignablesByRefundPointIdApi(
  data: GetApiContractServiceRefundFeeHeadersAssignablesByRefundPointData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    return structuredSuccessResponse(
      await client.refundFeeHeader.getApiContractServiceRefundFeeHeadersAssignablesByRefundPoint(data),
    );
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundTableHeadersApi(
  data: GetApiContractServiceRefundTableHeadersData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    return structuredSuccessResponse(await client.refundTableHeader.getApiContractServiceRefundTableHeaders(data));
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getRefundPointContractHeaderByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getContractServiceClient(session);
    return structuredSuccessResponse(
      await client.contractsRefundPoint.getApiContractServiceRefundPointsContractsContractHeadersById({id}),
    );
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getRefundTableHeadersByIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(await client.refundTableHeader.getApiContractServiceRefundTableHeadersById({id}));
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundFeeHeadersApi(
  data: GetApiContractServiceRefundFeeHeadersData,
  session?: Session | null,
) {
  try {
    const client = await getContractServiceClient(session);
    return structuredSuccessResponse(await client.refundFeeHeader.getApiContractServiceRefundFeeHeaders(data));
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundFeeHeadersByIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(await client.refundFeeHeader.getApiContractServiceRefundFeeHeadersById({id}));
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRebateTableHeadersByIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(await client.rebateTableHeader.getApiContractServiceRebateTableHeadersById({id}));
  } catch (error) {
    return structuredError(error);
  }
}
export async function getPaymentTypesByRefundPointIdApi(refundPointId: string) {
  try {
    const client = await getContractServiceClient();
    return structuredSuccessResponse(
      await client.refundFeeHeader.getApiContractServiceRefundFeeHeadersPaymentTypesByRefundPointByRefundPointId({
        refundPointId,
      }),
    );
  } catch (error) {
    return structuredError(error);
  }
}
