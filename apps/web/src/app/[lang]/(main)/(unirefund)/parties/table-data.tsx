import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto } from "@ayasofyazilim/saas/LocationService";
import type {
  UniRefund_CRMService_Customss_CreateCustomsOrganizationDto,
  UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto,
  UniRefund_CRMService_Merchants_CreateMerchantOrgnaizationDto,
  UniRefund_CRMService_NameCommonDatas_CreateNameCommonDataDto,
  UniRefund_CRMService_PersonalSummaries_CreatePersonalSummaryDto,
  UniRefund_CRMService_RefundPoints_CreateRefundPointOrganizationDto,
  UniRefund_CRMService_TaxFrees_CreateTaxFreeOrganizationDto,
  UniRefund_CRMService_TaxOffices_CreateTaxOfficeOrganizationDto,
  UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto,
} from "@ayasofyazilim/saas/CRMService";
import {
  $UniRefund_CRMService_Customss_CustomsProfileDto,
  $UniRefund_CRMService_Individuals_IndividualProfileDto,
  $UniRefund_CRMService_Merchants_MerchantProfileDto,
  $UniRefund_CRMService_Merchants_RefundPointProfileDto,
  $UniRefund_CRMService_TaxFrees_TaxFreeProfileDto,
  $UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
  $UniRefund_CRMService_Customss_CreateCustomsDto as CreateCustomsSchema,
  $UniRefund_CRMService_Merchants_CreateMerchantDto as CreateMerchantSchema,
  $UniRefund_CRMService_RefundPoints_CreateRefundPointDto as CreateRefundPointSchema,
  $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto as CreateTaxFreeSchema,
  $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto as CreateTaxOfficeSchema,
} from "@ayasofyazilim/saas/CRMService";
import { ContactFormSubPositions } from "@repo/ui/utils/table/form-schemas";
import { PhoneNumberUtil } from "google-libphonenumber";
import type { PartiesCreateType } from "./types";

export interface CreatePartiesDto {
  taxOfficeId: string;
  organization:
    | UniRefund_CRMService_Merchants_CreateMerchantOrgnaizationDto
    | UniRefund_CRMService_Customss_CreateCustomsOrganizationDto
    | UniRefund_CRMService_RefundPoints_CreateRefundPointOrganizationDto
    | UniRefund_CRMService_TaxFrees_CreateTaxFreeOrganizationDto
    | UniRefund_CRMService_TaxOffices_CreateTaxOfficeOrganizationDto;
  name: UniRefund_CRMService_NameCommonDatas_CreateNameCommonDataDto;
  personalSummaries: UniRefund_CRMService_PersonalSummaries_CreatePersonalSummaryDto;
  telephone: UniRefund_CRMService_TelephoneTypes_CreateTelephoneTypeWithComponentsDto;
  address: UniRefund_LocationService_AddressCommonDatas_AddressCommonDataCreateDto;
  email: UniRefund_CRMService_EmailCommonDatas_CreateEmailCommonDataWithComponentsDto;
}

const CommonOrganizationFields = ["name", "taxpayerId", "branchId"];
const OrganizationFields = ["customerNumber", "legalStatusCode"];
export const MerchantsFormSubPositions = {
  organization: [...CommonOrganizationFields, ...OrganizationFields],
  ...ContactFormSubPositions,
};
export const RefundPointsFormSubPositions = {
  organization: [...CommonOrganizationFields],
  ...ContactFormSubPositions,
};
export const CustomsFormSubPositions = {
  organization: [...CommonOrganizationFields],
  ...ContactFormSubPositions,
};
export const TaxFreeFormSubPositions = {
  organization: [...CommonOrganizationFields, ...OrganizationFields],
  ...ContactFormSubPositions,
};
export const TaxOfficesFormSubPositions = {
  organization: [...CommonOrganizationFields, ...OrganizationFields],
  ...ContactFormSubPositions,
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

function createScheme(schema: PartiesCreateType) {
  if (!("entityInformationTypes" in schema.properties)) {
    return {};
  }
  return {
    type: "object",
    properties: {
      taxOfficeId: {
        type: "string",
      },
      organization:
        schema.properties.entityInformationTypes.items.properties.organizations
          .items,
      telephone: {
        ...schema.properties.entityInformationTypes.items.properties
          .organizations.items.properties.contactInformations.items.properties
          .telephones.items,
        properties: {
          ...schema.properties.entityInformationTypes.items.properties
            .organizations.items.properties.contactInformations.items.properties
            .telephones.items.properties,
          localNumber,
        },
      },
      address:
        schema.properties.entityInformationTypes.items.properties.organizations
          .items.properties.contactInformations.items.properties.addresses
          .items,
      email:
        schema.properties.entityInformationTypes.items.properties.organizations
          .items.properties.contactInformations.items.properties.emails.items,
    },
  };
}

export const dataConfigOfParties = {
  merchants: {
    translationKey: "Merchants" as const,
    subEntityName: "Merchants.SubOrganization" as const,
    subEntityType: "STORE" as const,
    detailedFilters: [
      {
        name: "typeCodes",
        displayName: "Type Codes",
        type: "select-multiple" as const,
        value: "HEADQUARTER",
        multiSelectProps: {
          options: [
            {
              label: "HEADQUARTER",
              value: "HEADQUARTER",
            },
            {
              label: "STORE",
              value: "STORE",
            },
          ],
        },
      },
    ],
    createFormSchema: {
      schema: createScheme(CreateMerchantSchema),
      formPositions: [
        "organization",
        "telephone",
        "address",
        "email",
        "taxOfficeId",
      ],

      formSubPositions: MerchantsFormSubPositions,
      convertors: {},
    },
    tableSchema: {
      excludeList: [
        "id",
        "organizationId",
        "individualId",
        "parentCompanyId",
        "entityInformationTypeCodeName",
      ],
      schema: $UniRefund_CRMService_Merchants_MerchantProfileDto,
    },
  },
  "refund-points": {
    translationKey: "RefundPoints" as const,
    subEntityName: "Merchants.SubOrganization" as const,
    subEntityType: "REFUNDPOINT" as const,
    detailedFilters: [],
    createFormSchema: {
      schema: createScheme(CreateRefundPointSchema),
      formPositions: [
        "organization",
        "telephone",
        "address",
        "email",
        "taxOfficeId",
      ],
      formSubPositions: RefundPointsFormSubPositions,
      convertors: {},
    },
    tableSchema: {
      excludeList: [
        "id",
        "organizationId",
        "individualId",
        "entityInformationTypeCodeValue",
      ],
      schema: $UniRefund_CRMService_Merchants_RefundPointProfileDto,
    },
  },
  customs: {
    translationKey: "Customs" as const,
    subEntityName: "Merchants.SubOrganization" as const,
    subEntityType: "HEADQUARTER" as const,
    detailedFilters: [],
    createFormSchema: {
      schema: createScheme(CreateCustomsSchema),
      formPositions: ["organization", "telephone", "address", "email"],
      formSubPositions: CustomsFormSubPositions,
      convertors: {},
    },
    tableSchema: {
      excludeList: ["id", "organizationId"],
      schema: $UniRefund_CRMService_Customss_CustomsProfileDto,
    },
  },
  "tax-free": {
    translationKey: "TaxFree" as const,
    subEntityName: "Merchants.SubOrganization" as const,
    subEntityType: "HEADQUARTER" as const,
    detailedFilters: [],
    createFormSchema: {
      schema: createScheme(CreateTaxFreeSchema),
      formPositions: ["organization", "telephone", "address", "email"],
      formSubPositions: TaxFreeFormSubPositions,
      convertors: {},
    },
    tableSchema: {
      excludeList: ["id", "organizationId"],
      schema: $UniRefund_CRMService_TaxFrees_TaxFreeProfileDto,
    },
  },
  "tax-offices": {
    translationKey: "TaxOffices" as const,
    subEntityName: "Merchants.SubOrganization" as const,
    subEntityType: "HEADQUARTER" as const,
    detailedFilters: [],
    createFormSchema: {
      schema: createScheme(CreateTaxOfficeSchema),
      formPositions: ["organization", "telephone", "address", "email"],
      formSubPositions: TaxOfficesFormSubPositions,
      convertors: {},
    },
    tableSchema: {
      excludeList: ["id", "organizationId"],
      schema: $UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
    },
  },
  individuals: {
    translationKey: "Individuals" as const,
    subEntityName: "Merchants.SubOrganization" as const,
    subEntityType: "STORE" as const,
    detailedFilters: [],
    createFormSchema: {
      schema: {},
      formPositions: ["telephone", "address", "email"],

      formSubPositions: {},
      convertors: {},
    },
    tableSchema: {
      excludeList: ["id"],
      schema: $UniRefund_CRMService_Individuals_IndividualProfileDto,
    },
  },
};
