import type {
  UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto,
  UniRefund_CRMService_RefundPoints_CreateRefundPointOrganizationDto,
  UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto,
  UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto,
} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_RefundPoints_CreateRefundPointDto} from "@ayasofyazilim/saas/CRMService";
import {PhoneNumberUtil} from "google-libphonenumber";

export interface CreateRefundPointOrganizationSchema {
  taxpayerId: string;
  taxOfficeId: string;
  organization: UniRefund_CRMService_RefundPoints_CreateRefundPointOrganizationDto;
  telephone: UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto;
  address: UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto;
  email: UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto;
}

export const refundPointOrganizationFormSubPositions = {
  organization: ["name"],
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

export const $UniRefund_CRMService_RefundPoints_CreateRefundPointOrganizationFormDto = {
  type: "object",
  required: $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.required,
  properties: {
    organization:
      $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties.entityInformationTypes.items.properties
        .organizations.items,
    taxpayerId: $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties.taxpayerId,
    taxOfficeId: $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties.taxOfficeId,
    telephone: {
      ...$UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties.entityInformationTypes.items.properties
        .organizations.items.properties.contactInformations.items.properties.telephones.items,
      properties: {
        ...$UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties.entityInformationTypes.items.properties
          .organizations.items.properties.contactInformations.items.properties.telephones.items.properties.localNumber,
        localNumber,
      },
    },
    address:
      $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties.entityInformationTypes.items.properties
        .organizations.items.properties.contactInformations.items.properties.addresses.items,
    email:
      $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties.entityInformationTypes.items.properties
        .organizations.items.properties.contactInformations.items.properties.emails.items,
  },
};
