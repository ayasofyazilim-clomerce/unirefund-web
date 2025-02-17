import type {
  UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto,
  UniRefund_CRMService_TaxFrees_CreateTaxFreeOrganizationDto,
  UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto,
  UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto,
} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_TaxFrees_CreateTaxFreeDto} from "@ayasofyazilim/saas/CRMService";
import {PhoneNumberUtil} from "google-libphonenumber";

export interface CreateTaxFreeOrganizationSchema {
  taxpayerId: string;
  taxOfficeId: string;
  organization: UniRefund_CRMService_TaxFrees_CreateTaxFreeOrganizationDto;
  telephone: UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto;
  address: UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto;
  email: UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto;
}

export const taxFreeOrganizationFormSubPositions = {
  organization: ["name", "legalStatusCode"],
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

export const $UniRefund_CRMService_TaxFrees_CreateTaxFreesOrganizationFormDto = {
  type: "object",
  required: $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.required,
  properties: {
    organization:
      $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties.entityInformationTypes.items.properties.organizations
        .items,
    taxpayerId: $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties.taxpayerId,
    taxOfficeId: $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties.taxOfficeId,
    telephone: {
      ...$UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties.entityInformationTypes.items.properties
        .organizations.items.properties.contactInformations.items.properties.telephones.items,
      properties: {
        ...$UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties.entityInformationTypes.items.properties
          .organizations.items.properties.contactInformations.items.properties.telephones.items.properties.localNumber,
        localNumber,
      },
    },
    address:
      $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties.entityInformationTypes.items.properties.organizations
        .items.properties.contactInformations.items.properties.addresses.items,
    email:
      $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties.entityInformationTypes.items.properties.organizations
        .items.properties.contactInformations.items.properties.emails.items,
  },
};
