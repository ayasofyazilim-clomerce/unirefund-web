import {
  $UniRefund_CRMService_Merchants_CreateMerchantDto,
  $UniRefund_CRMService_RefundPoints_CreateRefundPointDto,
  $UniRefund_CRMService_Customss_CreateCustomsDto,
  $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto,
  $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto,
  $UniRefund_CRMService_Merchants_MerchantProfileDto,
  $UniRefund_CRMService_Customss_CustomsProfileDto,
  $UniRefund_CRMService_TaxFrees_TaxFreeProfileDto,
  $UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
  $UniRefund_CRMService_Merchants_RefundPointProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import type { TableData } from "src/utils";

interface DataConfig {
  displayName: string;
  default: string;
  pages: Record<string, TableData>;
}

const CommonOrganizationFields = [
  "name",
  "taxpayerId",
  "legalStatusCode",
  "customerNumber",
  "branchId",
];
const TelephoneSubPosition = ["localNumber", "typeCode"];
const AddressSubPosition = [
  "country",
  "terriority",
  "city",
  "postalCode",
  "addressLine",
  "fullAddress",
  "typeCode",
];
const EmailSubPosition = ["emailAddress", "typeCode"];

const MerchantsFormSubPositions = {
  organization: [...CommonOrganizationFields],
  telephone: TelephoneSubPosition,
  address: AddressSubPosition,
  email: EmailSubPosition,
};

const RefundPointsFormSubPositions = {
  organization: ["name", "taxpayerId", "branchId"],
  telephone: TelephoneSubPosition,
  address: AddressSubPosition,
  email: EmailSubPosition,
};

const CustomsFormSubPositions = {
  organization: ["name", "taxpayerId", "branchId"],
  telephone: TelephoneSubPosition,
  address: AddressSubPosition,
  email: EmailSubPosition,
};

const TaxFreeFormSubPositions = {
  organization: [...CommonOrganizationFields],
  telephone: TelephoneSubPosition,
  address: AddressSubPosition,
  email: EmailSubPosition,
};

const TaxOfficesFormSubPositions = {
  organization: [...CommonOrganizationFields],
  telephone: TelephoneSubPosition,
  address: AddressSubPosition,
  email: EmailSubPosition,
};

const createMerchantsScheme = {
  type: "object",
  properties: {
    organization:
      $UniRefund_CRMService_Merchants_CreateMerchantDto.properties
        .entityInformationTypes.items.properties.organizations.items,
    telephone:
      $UniRefund_CRMService_Merchants_CreateMerchantDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.telephones.items,
    address:
      $UniRefund_CRMService_Merchants_CreateMerchantDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.addresses.items,
    email:
      $UniRefund_CRMService_Merchants_CreateMerchantDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.emails.items,
  },
};

const createrefundPointsScheme = {
  type: "object",
  properties: {
    organization:
      $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties
        .entityInformationTypes.items.properties.organizations.items,
    telephone:
      $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.telephones.items,
    address:
      $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.addresses.items,
    email:
      $UniRefund_CRMService_RefundPoints_CreateRefundPointDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.emails.items,
  },
};

const createCustomsScheme = {
  type: "object",
  properties: {
    organization:
      $UniRefund_CRMService_Customss_CreateCustomsDto.properties
        .entityInformationTypes.items.properties.organizations.items,
    telephone:
      $UniRefund_CRMService_Customss_CreateCustomsDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.telephones.items,
    address:
      $UniRefund_CRMService_Customss_CreateCustomsDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.addresses.items,
    email:
      $UniRefund_CRMService_Customss_CreateCustomsDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.emails.items,
  },
};

const createTaxFreeScheme = {
  type: "object",
  properties: {
    organization:
      $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties
        .entityInformationTypes.items.properties.organizations.items,
    telephone:
      $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.telephones.items,
    address:
      $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.addresses.items,
    email:
      $UniRefund_CRMService_TaxFrees_CreateTaxFreeDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.emails.items,
  },
};

const createTaxOfficesScheme = {
  type: "object",
  properties: {
    organization:
      $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto.properties
        .entityInformationTypes.items.properties.organizations.items,
    telephone:
      $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.telephones.items,
    address:
      $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.addresses.items,
    email:
      $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto.properties
        .entityInformationTypes.items.properties.organizations.items.properties
        .contactInformations.items.properties.emails.items,
  },
};

export const dataConfigOfCrm: Record<string, DataConfig> = {
  companies: {
    displayName: "Companies",
    default: "merchants",
    pages: {
      merchants: {
        title: "Merchants",
        createFormSchema: {
          schema: createMerchantsScheme,
          formPositions: ["organization", "telephone", "address", "email"],
          formSubPositions: MerchantsFormSubPositions,
        },
        tableSchema: {
          excludeList: [
            "id",
            "organizationId",
            "individualId",
            "parentCompanyId",
          ],
          schema: $UniRefund_CRMService_Merchants_MerchantProfileDto,
        },
      },
      "refund-points": {
        title: "Refund Points",
        createFormSchema: {
          schema: createrefundPointsScheme,
          formPositions: ["organization", "telephone", "address", "email"],
          formSubPositions: RefundPointsFormSubPositions,
        },

        tableSchema: {
          excludeList: ["id", "organizationId", "individualId"],
          schema: $UniRefund_CRMService_Merchants_RefundPointProfileDto,
        },
      },
      customs: {
        title: "Customs",
        filterBy: "",
        createFormSchema: {
          schema: createCustomsScheme,
          formPositions: ["organization", "telephone", "address", "email"],
          formSubPositions: CustomsFormSubPositions,
        },

        tableSchema: {
          excludeList: ["id", "organizationId"],
          schema: $UniRefund_CRMService_Customss_CustomsProfileDto,
        },
      },
      "tax-free": {
        title: "Tax Free",
        filterBy: "",
        createFormSchema: {
          schema: createTaxFreeScheme,
          formPositions: ["organization", "telephone", "address", "email"],
          formSubPositions: TaxFreeFormSubPositions,
        },

        tableSchema: {
          excludeList: ["id", "organizationId"],
          schema: $UniRefund_CRMService_TaxFrees_TaxFreeProfileDto,
        },
      },
      "tax-offices": {
        title: "Tax Offices",
        filterBy: "",
        createFormSchema: {
          schema: createTaxOfficesScheme,
          formPositions: ["organization", "telephone", "address", "email"],
          formSubPositions: TaxOfficesFormSubPositions,
        },

        tableSchema: {
          excludeList: ["id", "organizationId"],
          schema: $UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
        },
      },
    },
  },
};
