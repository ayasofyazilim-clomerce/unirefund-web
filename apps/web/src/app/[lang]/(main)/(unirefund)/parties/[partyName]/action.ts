"use server";
import type { UniRefund_CRMService_Individuals_CreateIndividualDto } from "@ayasofyazilim/saas/CRMService";
import type { PartyNameType } from "src/actions/unirefund/CrmService/types";
import {
  getCRMServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";
import type {
  CreateCustomsDTO,
  CreateMerchantDTO,
  CreateRefundPointDTO,
  CreateTaxFreeDTO,
  CreateTaxOfficeDTO,
  PartiesCreateDTOType,
} from "../types";

export async function getPartyRequests(partyType: PartyNameType) {
  const client = await getCRMServiceClient();
  const partyRequests = {
    merchants: {
      post: async (data: PartiesCreateDTOType) =>
        await client.merchant.postApiCrmServiceMerchantsWithComponents({
          requestBody: data as CreateMerchantDTO,
        }),
    },
    "refund-points": {
      post: async (data: PartiesCreateDTOType) =>
        await client.refundPoint.postApiCrmServiceRefundPointsWithComponents({
          requestBody: data as CreateRefundPointDTO,
        }),
    },
    customs: {
      post: async (data: PartiesCreateDTOType) =>
        await client.customs.postApiCrmServiceCustomsWithComponents({
          requestBody: data as CreateCustomsDTO,
        }),
    },
    "tax-free": {
      post: async (data: PartiesCreateDTOType) =>
        await client.taxFree.postApiCrmServiceTaxFreesWithComponents({
          requestBody: data as CreateTaxFreeDTO,
        }),
    },
    "tax-offices": {
      post: async (data: PartiesCreateDTOType) =>
        await client.taxOffice.postApiCrmServiceTaxOfficesWithComponents({
          requestBody: data as CreateTaxOfficeDTO,
        }),
    },
    individuals: {
      post: async (
        form: UniRefund_CRMService_Individuals_CreateIndividualDto,
      ) => {
        return await client.individual.postApiCrmServiceIndividualsWithComponents(
          {
            requestBody: form,
          },
        );
      },
    },
  };
  return partyRequests[partyType];
}

export async function createPartyRow(
  partyType: PartyNameType,
  data: PartiesCreateDTOType,
) {
  const client = await getPartyRequests(partyType);
  try {
    const response = await client.post(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
