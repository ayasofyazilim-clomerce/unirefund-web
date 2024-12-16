"use server";
import { getCRMServiceClient, structuredError } from "src/lib";
import type { PartyNameType } from "../../types";
import type {
  PutAddress,
  PutEmail,
  PutMerchantBase,
  PutMerchantOrganization,
  PutName,
  PutOrganization,
  PutPersonalSummaries,
  PutRefundPointOrganization,
  PutTaxFreeOrganization,
  PutTelephone,
} from "./types";

export async function putPartyRequests(
  partyType: Exclude<PartyNameType, "individuals">,
) {
  const client = await getCRMServiceClient();
  const partyRequests = {
    merchants: {
      putOrganization: async (form: PutOrganization["data"]) => {
        const data = form as PutMerchantOrganization;
        return await client.merchant.putApiCrmServiceMerchantsByIdOrganizationsByOrganizationId(
          {
            requestBody: data.requestBody,
            organizationId: data.organizationId,
            id: data.id,
          },
        );
      },
      putTelephone: async (form: PutTelephone["data"]) => {
        const data = form;
        return await client.merchant.putApiCrmServiceMerchantsByIdTelephonesByTelephoneId(
          {
            requestBody: data.requestBody,
            telephoneId: data.telephoneId,
            id: data.id,
          },
        );
      },
      putAddress: async (form: PutAddress["data"]) => {
        const data = form;
        return await client.merchant.putApiCrmServiceMerchantsByIdAddressesByAddressId(
          {
            requestBody: data.requestBody,
            addressId: data.addressId,
            id: data.id,
          },
        );
      },
      putEmail: async (form: PutEmail["data"]) => {
        const data = form;
        return await client.merchant.putApiCrmServiceMerchantsByIdEmailsByEmailId(
          {
            requestBody: data.requestBody,
            emailId: data.emailId,
            id: data.id,
          },
        );
      },
      putName: async (form: PutName["data"]) => {
        const data = form;
        return await client.merchant.putApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameId(
          {
            requestBody: data.requestBody,
            nameId: data.nameId,
            individualId: data.individualId,
            id: data.id,
          },
        );
      },
      putPersonalSummaries: async (form: PutPersonalSummaries["data"]) => {
        const data = form;
        return await client.merchant.putApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryId(
          {
            requestBody: data.requestBody,
            personalSummaryId: data.personalSummaryId,
            individualId: data.individualId,
            id: data.id,
          },
        );
      },
      putMerchantBase: async (form: PutMerchantBase["data"]) => {
        return await client.merchant.putApiCrmServiceMerchantsById({
          requestBody: form.requestBody,
          id: form.id,
        });
      },
    },
    "refund-points": {
      putOrganization: async (form: PutOrganization["data"]) => {
        const data = form as PutRefundPointOrganization;
        return await client.refundPoint.putApiCrmServiceRefundPointsByIdOrganizationsByOrganizationId(
          {
            requestBody: data.requestBody,
            organizationId: data.organizationId,
            id: data.id,
          },
        );
      },
      putTelephone: async (form: PutTelephone["data"]) => {
        const data = form;
        return await client.refundPoint.putApiCrmServiceRefundPointsByIdTelephonesByTelephoneId(
          {
            requestBody: data.requestBody,
            telephoneId: data.telephoneId,
            id: data.id,
          },
        );
      },
      putAddress: async (form: PutAddress["data"]) => {
        const data = form;
        return await client.refundPoint.putApiCrmServiceRefundPointsByIdAddressesByAddressId(
          {
            requestBody: data.requestBody,
            addressId: data.addressId,
            id: data.id,
          },
        );
      },
      putEmail: async (form: PutEmail["data"]) => {
        const data = form;
        return await client.refundPoint.putApiCrmServiceRefundPointsByIdEmailsByEmailId(
          {
            requestBody: data.requestBody,
            emailId: data.emailId,
            id: data.id,
          },
        );
      },
      putName: () => {
        //need for type definition
      },
      putPersonalSummaries: () => {
        //need for type definition
      },
      putMerchantBase: () => {
        //need for type definition
      },
    },
    customs: {
      putOrganization: async (form: PutOrganization["data"]) => {
        const data = form as PutRefundPointOrganization;
        return await client.customs.putApiCrmServiceCustomsByIdOrganizationsByOrganizationId(
          {
            requestBody: data.requestBody,
            organizationId: data.organizationId,
            id: data.id,
          },
        );
      },
      putTelephone: async (form: PutTelephone["data"]) => {
        const data = form;
        return await client.customs.putApiCrmServiceCustomsByIdTelephonesByTelephoneId(
          {
            requestBody: data.requestBody,
            telephoneId: data.telephoneId,
            id: data.id,
          },
        );
      },
      putAddress: async (form: PutAddress["data"]) => {
        const data = form;
        return await client.customs.putApiCrmServiceCustomsByIdAddressesByAddressId(
          {
            requestBody: data.requestBody,
            addressId: data.addressId,
            id: data.id,
          },
        );
      },
      putEmail: async (form: PutEmail["data"]) => {
        const data = form;
        return await client.customs.putApiCrmServiceCustomsByIdEmailsByEmailId({
          requestBody: data.requestBody,
          emailId: data.emailId,
          id: data.id,
        });
      },
      putName: () => {
        //need for type definition
      },
      putPersonalSummaries: () => {
        //need for type definition
      },
      putMerchantBase: () => {
        //need for type definition
      },
    },
    "tax-free": {
      putOrganization: async (form: PutOrganization["data"]) => {
        const data = form as PutTaxFreeOrganization;
        return await client.taxFree.putApiCrmServiceTaxFreesByIdOrganizationsByOrganizationId(
          {
            requestBody: data.requestBody,
            organizationId: data.organizationId,
            id: data.id,
          },
        );
      },
      putTelephone: async (form: PutTelephone["data"]) => {
        const data = form;
        return await client.taxFree.putApiCrmServiceTaxFreesByIdTelephonesByTelephoneId(
          {
            requestBody: data.requestBody,
            telephoneId: data.telephoneId,
            id: data.id,
          },
        );
      },
      putAddress: async (form: PutAddress["data"]) => {
        const data = form;
        return await client.taxFree.putApiCrmServiceTaxFreesByIdAddressesByAddressId(
          {
            requestBody: data.requestBody,
            addressId: data.addressId,
            id: data.id,
          },
        );
      },
      putEmail: async (form: PutEmail["data"]) => {
        const data = form;
        return await client.taxFree.putApiCrmServiceTaxFreesByIdEmailsByEmailId(
          {
            requestBody: data.requestBody,
            emailId: data.emailId,
            id: data.id,
          },
        );
      },
      putName: () => {
        //need for type definition
      },
      putPersonalSummaries: () => {
        //need for type definition
      },
      putMerchantBase: () => {
        //need for type definition
      },
    },
    "tax-offices": {
      putOrganization: async (form: PutOrganization["data"]) => {
        const data = form as PutTaxFreeOrganization;
        return await client.taxOffice.putApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationId(
          {
            requestBody: data.requestBody,
            organizationId: data.organizationId,
            id: data.id,
          },
        );
      },
      putTelephone: async (form: PutTelephone["data"]) => {
        const data = form;
        return await client.taxOffice.putApiCrmServiceTaxOfficesByIdTelephonesByTelephoneId(
          {
            requestBody: data.requestBody,
            telephoneId: data.telephoneId,
            id: data.id,
          },
        );
      },
      putAddress: async (form: PutAddress["data"]) => {
        const data = form;
        return await client.taxOffice.putApiCrmServiceTaxOfficesByIdAddressesByAddressId(
          {
            requestBody: data.requestBody,
            addressId: data.addressId,
            id: data.id,
          },
        );
      },
      putEmail: async (form: PutEmail["data"]) => {
        const data = form;
        return await client.taxOffice.putApiCrmServiceTaxOfficesByIdEmailsByEmailId(
          {
            requestBody: data.requestBody,
            emailId: data.emailId,
            id: data.id,
          },
        );
      },
      putName: () => {
        //need for type definition
      },
      putPersonalSummaries: () => {
        //need for type definition
      },
      putMerchantBase: () => {
        //need for type definition
      },
    },
  };
  return partyRequests[partyType];
}

export async function putParty(
  partyType: Exclude<PartyNameType, "individuals">,
  params:
    | PutOrganization
    | PutTelephone
    | PutAddress
    | PutEmail
    | PutName
    | PutPersonalSummaries
    | PutMerchantBase,
) {
  const client = await putPartyRequests(partyType);
  try {
    let response;
    if (params.action === "merchant-base") {
      response = await client.putMerchantBase(params.data);
    } else if (params.action === "organization") {
      response = await client.putOrganization(params.data);
    } else if (params.action === "name") {
      response = await client.putName(params.data);
    } else if (params.action === "personal-summaries") {
      response = await client.putPersonalSummaries(params.data);
    } else if (params.action === "telephone") {
      response = await client.putTelephone(params.data);
    } else if (params.action === "address") {
      response = await client.putAddress(params.data);
    } else {
      response = await client.putEmail(params.data);
    }
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
