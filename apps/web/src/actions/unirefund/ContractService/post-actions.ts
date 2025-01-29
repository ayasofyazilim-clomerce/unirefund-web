"use server";

import type {
  PostApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdRebateSettingsData,
  PostApiContractServiceRebateTableHeadersData,
  PostApiContractServiceRefundFeeHeadersData,
  PostApiContractServiceRefundPointsByIdContractsContractHeadersData,
  PostApiContractServiceRefundTableHeadersData,
} from "@ayasofyazilim/saas/ContractService";
import { structuredResponse, structuredError } from "@repo/utils/api";
import { getContractServiceClient } from "src/lib";

export async function postRefundTableHeadersApi(
  data: PostApiContractServiceRefundTableHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.refundTableHeader.postApiContractServiceRefundTableHeaders(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postRebateTableHeadersApi(
  data: PostApiContractServiceRebateTableHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.rebateTableHeader.postApiContractServiceRebateTableHeaders(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postRefundFeeHeadersApi(
  data: PostApiContractServiceRefundFeeHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    const response =
      await client.refundFeeHeader.postApiContractServiceRefundFeeHeaders(data);
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
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdRebateSettings(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}

export async function postMerchantContractHeaderValidateByHeaderIdApi(
  id: string,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdValidate(
        { id },
      ),
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
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdContractStores(
        data,
      ),
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
      await client.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdContractStores(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postRefundPointContractHeadersById(
  data: PostApiContractServiceRefundPointsByIdContractsContractHeadersData,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsRefundPoint.postApiContractServiceRefundPointsByIdContractsContractHeaders(
        data,
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
export async function postRefundPointContractHeaderValidateByHeaderId(
  id: string,
) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsRefundPoint.postApiContractServiceRefundPointsContractsContractHeadersByIdValidate(
        { id },
      ),
    );
  } catch (error) {
    return structuredError(error);
  }
}
