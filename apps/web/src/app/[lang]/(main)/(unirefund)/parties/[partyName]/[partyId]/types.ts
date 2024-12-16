import type {
  $UniRefund_CRMService_Customss_UpdateCustomsOrganizationDto,
  $UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
  $UniRefund_CRMService_Organizations_UpdateOrganizationDto,
  $UniRefund_CRMService_RefundPoints_UpdateRefundPointOrganizationDto,
  $UniRefund_CRMService_TelephoneTypes_UpdateTelephoneTypeDto,
  PutApiCrmServiceCustomsByIdAddressesByAddressIdData,
  PutApiCrmServiceCustomsByIdEmailsByEmailIdData,
  PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceCustomsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceMerchantsByIdData,
  PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryIdData,
  PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData,
  PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceTaxFreesByIdEmailsByEmailIdData,
  PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceTaxFreesByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceTaxOfficesByIdEmailsByEmailIdData,
  PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceTaxOfficesByIdTelephonesByTelephoneIdData,
  UniRefund_CRMService_Customss_CustomsDto,
  UniRefund_CRMService_Merchants_MerchantDto,
  UniRefund_CRMService_RefundPoints_RefundPointDto,
  UniRefund_CRMService_TaxFrees_TaxFreeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto,
} from "@ayasofyazilim/saas/CRMService";

export type PutOrganization =
  | {
      action: "organization";
      data: PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData;
    }
  | {
      action: "organization";
      data: PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData;
    }
  | {
      action: "organization";
      data: PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData;
    }
  | {
      action: "organization";
      data: PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData;
    }
  | {
      action: "organization";
      data: PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData;
    };

export type PutTelephone =
  | {
      action: "telephone";
      data: PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData;
    }
  | {
      action: "telephone";
      data: PutApiCrmServiceTaxOfficesByIdTelephonesByTelephoneIdData;
    }
  | {
      action: "telephone";
      data: PutApiCrmServiceTaxFreesByIdTelephonesByTelephoneIdData;
    }
  | {
      action: "telephone";
      data: PutApiCrmServiceCustomsByIdTelephonesByTelephoneIdData;
    }
  | {
      action: "telephone";
      data: PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData;
    };

export interface PutAddress {
  action: "address";
  data: PutApiCrmServiceCustomsByIdAddressesByAddressIdData;
}

export type PutEmail =
  | {
      action: "email";
      data: PutApiCrmServiceMerchantsByIdEmailsByEmailIdData;
    }
  | {
      action: "email";
      data: PutApiCrmServiceTaxOfficesByIdEmailsByEmailIdData;
    }
  | {
      action: "email";
      data: PutApiCrmServiceTaxFreesByIdEmailsByEmailIdData;
    }
  | {
      action: "email";
      data: PutApiCrmServiceCustomsByIdEmailsByEmailIdData;
    }
  | {
      action: "email";
      data: PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData;
    };

export interface PutName {
  action: "name";
  data: PutApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameIdData;
}
export interface PutPersonalSummaries {
  action: "personal-summaries";
  data: PutApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryIdData;
}
export interface PutMerchantBase {
  action: "merchant-base";
  data: PutApiCrmServiceMerchantsByIdData;
}

export type GetPartiesDetailResult =
  | UniRefund_CRMService_RefundPoints_RefundPointDto
  | UniRefund_CRMService_Merchants_MerchantDto
  | UniRefund_CRMService_Customss_CustomsDto
  | UniRefund_CRMService_TaxFrees_TaxFreeDto
  | UniRefund_CRMService_TaxOffices_TaxOfficeDto;

export type PutMerchantOrganization =
  PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData;
export type PutCustomsOrganization =
  PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData;
export type PutRefundPointOrganization =
  PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData;
export type PutTaxFreeOrganization =
  PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData;
export type PutTaxOfficeOrganization =
  PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData;

export type PutActions = "organization" | "telephone" | "address" | "email";

export type PartiesOrganizationUpdateType =
  | typeof $UniRefund_CRMService_RefundPoints_UpdateRefundPointOrganizationDto
  | typeof $UniRefund_CRMService_Customss_UpdateCustomsOrganizationDto
  | typeof $UniRefund_CRMService_Organizations_UpdateOrganizationDto;

export type PartiesTelephoneUpdateType =
  typeof $UniRefund_CRMService_TelephoneTypes_UpdateTelephoneTypeDto;

export type PartiesEmailUpdateType =
  typeof $UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto;
