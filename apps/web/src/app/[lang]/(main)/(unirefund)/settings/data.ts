/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: we need to fix this*/
import {
  $UniRefund_SettingService_ProductGroups_CreateProductGroupDto,
  $UniRefund_SettingService_ProductGroups_ProductGroupDto,
  $UniRefund_SettingService_ProductGroups_UpdateProductGroupDto,
  $UniRefund_SettingService_Vats_CreateVatDto,
  $UniRefund_SettingService_Vats_UpdateVatDto,
  $UniRefund_SettingService_Vats_VatDetailDto,
} from "@ayasofyazilim/saas/SettingService";

export const dataConfigOfManagement: Record<string, any> = {
  product: {
    displayName: "VATSettings",
    default: "vats",
    vats: {
      title: "Vat",
      createFormSchema: {
        formPositions: ["percent", "minimumTotalAmount", "active"],
        schema: $UniRefund_SettingService_Vats_CreateVatDto,
      },
      editFormSchema: {
        formPositions: ["percent", "minimumTotalAmount", "active"],
        schema: $UniRefund_SettingService_Vats_UpdateVatDto,
      },
      tableSchema: {
        excludeList: [
          "id",
          "creationTime",
          "creatorId",
          "lastModificationTime",
          "lastModifierId",
          "isDeleted",
          "deleterId",
          "deletionTime",
        ],
        schema: $UniRefund_SettingService_Vats_VatDetailDto,
      },
    },
    "product-groups": {
      title: "Product Group",
      createFormSchema: {
        formPositions: [
          "name",
          "articleCode",
          "unitCode",
          "companyType",
          "vatId",
          "active",
          "food",
        ],
        schema: $UniRefund_SettingService_ProductGroups_CreateProductGroupDto,
      },
      editFormSchema: {
        formPositions: [
          "name",
          "articleCode",
          "unitCode",
          "companyType",
          "vatId",
          "active",
          "food",
        ],
        schema: $UniRefund_SettingService_ProductGroups_UpdateProductGroupDto,
      },
      tableSchema: {
        excludeList: ["id"],
        schema: $UniRefund_SettingService_ProductGroups_ProductGroupDto,
      },
    },
  },
};
