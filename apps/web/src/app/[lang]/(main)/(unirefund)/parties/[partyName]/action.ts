"use server";
import type { UniRefund_CRMService_Individuals_CreateIndividualDto } from "@ayasofyazilim/saas/CRMService";
import { getCRMServiceClient, structuredError } from "src/lib";
import type {
  CreateCustomsDTO,
  CreateMerchantDTO,
  CreateRefundPointDTO,
  CreateTaxFreeDTO,
  CreateTaxOfficeDTO,
  PartiesCreateDTOType,
  PartyNameType,
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
    return {
      type: "success",
      data: response,
      status: 200,
      message: "",
    };
  } catch (error) {
    return structuredError(error);
  }
}
