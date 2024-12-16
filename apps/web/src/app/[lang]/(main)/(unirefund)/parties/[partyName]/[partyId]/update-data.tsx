import type {
  UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto,
  UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto,
} from "@ayasofyazilim/saas/CRMService";
import {
  $UniRefund_CRMService_Customss_UpdateCustomsOrganizationDto,
  $UniRefund_CRMService_Organizations_UpdateOrganizationDto,
  $UniRefund_CRMService_RefundPoints_UpdateRefundPointOrganizationDto,
} from "@ayasofyazilim/saas/CRMService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto } from "@ayasofyazilim/saas/LocationService";
import {
  CustomsFormSubPositions,
  MerchantsFormSubPositions,
  RefundPointsFormSubPositions,
  TaxFreeFormSubPositions,
  TaxOfficesFormSubPositions,
} from "../../table-data";
import type { PutOrganization } from "./types";

export interface UpdatePartiesDto {
  taxOfficeId: string;
  organizationSchema: PutOrganization;
  telephone: UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto;
  address: UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto;
  email: UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto;
}

export const editSchemasOfParties = {
  merchants: {
    organizationSchema:
      $UniRefund_CRMService_Organizations_UpdateOrganizationDto,
    organizationSchemaSubPositions: MerchantsFormSubPositions.organization,
  },
  "refund-points": {
    organizationSchema:
      $UniRefund_CRMService_RefundPoints_UpdateRefundPointOrganizationDto,
    organizationSchemaSubPositions: RefundPointsFormSubPositions.organization,
  },
  customs: {
    organizationSchema:
      $UniRefund_CRMService_Customss_UpdateCustomsOrganizationDto,
    organizationSchemaSubPositions: CustomsFormSubPositions.organization,
  },
  "tax-free": {
    organizationSchema:
      $UniRefund_CRMService_Organizations_UpdateOrganizationDto,
    organizationSchemaSubPositions: TaxFreeFormSubPositions.organization,
  },
  "tax-offices": {
    organizationSchema:
      $UniRefund_CRMService_Organizations_UpdateOrganizationDto,
    organizationSchemaSubPositions: TaxOfficesFormSubPositions.organization,
  },
};
