import type {
  $UniRefund_CRMService_Customss_CreateCustomsDto as CreateCustomsSchema,
  $UniRefund_CRMService_Individuals_CreateIndividualDto as CreateIndividualSchema,
  $UniRefund_CRMService_Merchants_CreateMerchantDto as CreateMerchantSchema,
  $UniRefund_CRMService_RefundPoints_CreateRefundPointDto as CreateRefundPointSchema,
  $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto as CreateTaxFreeSchema,
  $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto as CreateTaxOfficeSchema,
  UniRefund_CRMService_Customss_CreateCustomsDto,
  UniRefund_CRMService_Customss_CustomsDto,
  UniRefund_CRMService_Individuals_CreateIndividualDto,
  UniRefund_CRMService_Individuals_IndividualDto,
  UniRefund_CRMService_Merchants_CreateMerchantDto,
  UniRefund_CRMService_Merchants_MerchantDto,
  UniRefund_CRMService_RefundPoints_CreateRefundPointDto,
  UniRefund_CRMService_RefundPoints_RefundPointDto,
  UniRefund_CRMService_TaxFrees_CreateTaxFreeDto,
  UniRefund_CRMService_TaxFrees_TaxFreeDto,
  UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto,
} from "@ayasofyazilim/saas/CRMService";

export type CreateMerchantDTO =
  UniRefund_CRMService_Merchants_CreateMerchantDto;
export type CreateCustomsDTO = UniRefund_CRMService_Customss_CreateCustomsDto;
export type CreateRefundPointDTO =
  UniRefund_CRMService_RefundPoints_CreateRefundPointDto;
export type CreateTaxFreeDTO = UniRefund_CRMService_TaxFrees_CreateTaxFreeDto;
export type CreateTaxOfficeDTO =
  UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto;
export type CreateIndividualDTO =
  UniRefund_CRMService_Individuals_CreateIndividualDto;

export type GetMerchantDTO = UniRefund_CRMService_Merchants_MerchantDto;
export type GetRefundPointDTO =
  UniRefund_CRMService_RefundPoints_RefundPointDto;
export type GetCustomsDTO = UniRefund_CRMService_Customss_CustomsDto;
export type GetTaxFreeDTO = UniRefund_CRMService_TaxFrees_TaxFreeDto;
export type GetTaxOfficeDTO = UniRefund_CRMService_TaxOffices_TaxOfficeDto;
export type GetIndividualDTO = UniRefund_CRMService_Individuals_IndividualDto;

export type PartyNameType =
  | "merchants"
  | "refund-points"
  | "customs"
  | "tax-free"
  | "tax-offices"
  | "individuals";

export type PartiesResultType =
  | GetMerchantDTO
  | GetRefundPointDTO
  | GetCustomsDTO
  | GetTaxFreeDTO
  | GetTaxOfficeDTO
  | GetIndividualDTO;

export type PartiesCreateDTOType =
  | CreateMerchantDTO
  | CreateCustomsDTO
  | CreateRefundPointDTO
  | CreateTaxFreeDTO
  | CreateTaxOfficeDTO
  | CreateIndividualDTO;

export type PartiesCreateType =
  | typeof CreateMerchantSchema
  | typeof CreateRefundPointSchema
  | typeof CreateCustomsSchema
  | typeof CreateTaxFreeSchema
  | typeof CreateTaxOfficeSchema
  | typeof CreateIndividualSchema;
