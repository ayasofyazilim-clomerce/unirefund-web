import type {UniRefund_CRMService_Enums_EntityPartyTypeCode} from "@ayasofyazilim/saas/CRMService";
import type {PartyNameType} from "@repo/actions/unirefund/CrmService/types";

export const entityPartyTypeCodeMap: Record<
  Exclude<PartyNameType, "individuals">,
  UniRefund_CRMService_Enums_EntityPartyTypeCode
> = {
  customs: "CUSTOMS",
  merchants: "MERCHANT",
  "refund-points": "REFUNDPOINT",
  "tax-free": "TAXFREE",
  "tax-offices": "TAXOFFICE",
};
