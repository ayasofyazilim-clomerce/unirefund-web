import type {
  UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto,
  UniRefund_CRMService_NameCommonDatas_CreateNameCommonDataDto,
  UniRefund_CRMService_PersonalSummaries_CreatePersonalSummaryDto,
  UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto,
  UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto,
} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_Merchants_CreateMerchantDto} from "@ayasofyazilim/saas/CRMService";
import {PhoneNumberUtil} from "google-libphonenumber";

export interface CreateMerchantIndividualSchema {
  taxpayerId: string;
  customerNumber: string;
  taxOfficeId: string;
  name: UniRefund_CRMService_NameCommonDatas_CreateNameCommonDataDto;
  personalSummaries: UniRefund_CRMService_PersonalSummaries_CreatePersonalSummaryDto;
  telephone: UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto;
  address: UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto;
  email: UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto;
}

export const merchantIndividualFormSubPositions = {
  name: ["salutation", "firstName", "lastName", "suffix", "mailingName", "officialName"],
  personalSummaries: [
    "date",
    "birthDate",
    "ethnicity",
    "maritalStatusCode",
    "religiousAffiliationName",
    "genderTypeCode",
  ],
  telephone: ["localNumber"],
  address: ["countryId", "regionId", "cityId", "postalCode", "addressLine", "type"],
  email: ["emailAddress"],
};

export const localNumber = {
  type: "string",
  refine: {
    params: {
      message: "Please enter a valid phone number.",
    },
    callback: (value: string) => {
      try {
        const phoneUtil = PhoneNumberUtil.getInstance();
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(value));
      } catch (error) {
        return false;
      }
    },
  },
};

export const $UniRefund_CRMService_Merchants_CreateMerchantIndividualFormDto = {
  type: "object",
  required: $UniRefund_CRMService_Merchants_CreateMerchantDto.required,
  properties: {
    taxpayerId: $UniRefund_CRMService_Merchants_CreateMerchantDto.properties.taxpayerId,
    customerNumber: $UniRefund_CRMService_Merchants_CreateMerchantDto.properties.customerNumber,
    taxOfficeId: $UniRefund_CRMService_Merchants_CreateMerchantDto.properties.taxOfficeId,
    name: $UniRefund_CRMService_Merchants_CreateMerchantDto.properties.entityInformationTypes.items.properties
      .individuals.items.properties.name,
    personalSummaries:
      $UniRefund_CRMService_Merchants_CreateMerchantDto.properties.entityInformationTypes.items.properties.individuals
        .items.properties.personalSummaries.items,
    telephone: {
      ...$UniRefund_CRMService_Merchants_CreateMerchantDto.properties.entityInformationTypes.items.properties
        .individuals.items.properties.contactInformations.items.properties.telephones.items,
      properties: {
        ...$UniRefund_CRMService_Merchants_CreateMerchantDto.properties.entityInformationTypes.items.properties
          .individuals.items.properties.contactInformations.items.properties.telephones.items.properties.localNumber,
        localNumber,
      },
    },
    address:
      $UniRefund_CRMService_Merchants_CreateMerchantDto.properties.entityInformationTypes.items.properties.individuals
        .items.properties.contactInformations.items.properties.addresses.items,
    email:
      $UniRefund_CRMService_Merchants_CreateMerchantDto.properties.entityInformationTypes.items.properties.individuals
        .items.properties.contactInformations.items.properties.emails.items,
  },
};
