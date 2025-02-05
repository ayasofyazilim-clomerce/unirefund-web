import type {
  UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
  UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
  UniRefund_CRMService_Enums_EntityPartyTypeCode,
  UniRefund_CRMService_NameCommonDatas_UpdateNameCommonDataDto,
  UniRefund_CRMService_Organizations_UpdateOrganizationDto,
  UniRefund_CRMService_PersonalSummaries_UpdatePersonalSummaryDto,
  UniRefund_CRMService_TelephoneTypes_UpdateTelephoneTypeDto,
} from "@ayasofyazilim/saas/CRMService";

export type EmailAddressUpdateDto = UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto;
export type TelephoneUpdateDto = UniRefund_CRMService_TelephoneTypes_UpdateTelephoneTypeDto;
export type IndividualPersonalSummariesUpdateDto = UniRefund_CRMService_PersonalSummaries_UpdatePersonalSummaryDto;
export type IndividualNameUpdateDto = UniRefund_CRMService_NameCommonDatas_UpdateNameCommonDataDto;
export type OrganizationUpdateDto = UniRefund_CRMService_Organizations_UpdateOrganizationDto;
export type AffiliationsPostDto = UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto;

export type PartyNameType = "merchants" | "refund-points" | "customs" | "tax-free" | "tax-offices" | "individuals";

export const partyNameToEntityPartyTypeCode: Record<
  Exclude<PartyNameType, "individuals">,
  UniRefund_CRMService_Enums_EntityPartyTypeCode
> = {
  merchants: "MERCHANT",
  "refund-points": "REFUNDPOINT",
  customs: "CUSTOMS",
  "tax-offices": "TAXOFFICE",
  "tax-free": "TAXFREE",
};
