import type {
  UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto,
  UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto,
} from "@ayasofyazilim/saas/CRMService";
import {
  $UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto,
  $UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto,
} from "@ayasofyazilim/saas/CRMService";
import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { CheckCircle, Plus, Star, Trash, XCircle } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  handleDeleteResponse,
  handlePostResponse,
} from "src/actions/core/api-utils-client";
import { deleteMerchantsByIdProductGroupsApi } from "src/actions/unirefund/CrmService/detele-actions";
import {
  postMerchantsByIdProductGroupByProductGroupIdDefaultApi,
  postMerchantsByIdProductGroupsApi,
} from "src/actions/unirefund/CrmService/post-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

type ProductGroupsTable =
  TanstackTableCreationProps<UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto>;

export function productGroupsColumns(
  languageData: CRMServiceServiceResource,
  locale: string,
) {
  return tanstackTableCreateColumnsByRowData<UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto>(
    {
      rows: $UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.Merchant.productGroup",
      },
      config: {
        locale,
      },
      faceted: {
        isActive: {
          options: [
            {
              value: "true",
              label: "",
              icon: CheckCircle,
              iconClassName: "text-green-700",
            },
            {
              value: "false",
              label: "",
              icon: XCircle,
              iconClassName: "text-red-700",
            },
          ],
        },
      },
      badges: {
        productGroupName: {
          values: [
            {
              position: "after",
              label: "Default",
              badgeClassName: "text-green-700 bg-green-100 border-green-500",
              conditions: [
                {
                  when: (value) => value === true,
                  conditionAccessorKey: "isDefault",
                },
              ],
            },
          ],
        },
      },
    },
  );
}

function productGroupsTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  productGroupsList: UniRefund_SettingService_ProductGroups_ProductGroupDto[],
  partId: string,
): ProductGroupsTable {
  const table: ProductGroupsTable = {
    fillerColumn: "productGroupName",
    columnVisibility: {
      type: "hide",
      columns: ["isAssign", "isDefault", "productGroupId"],
    },
    columnOrder: ["productGroupName", "isActive"],
    tableActions: [
      {
        type: "custom-dialog",
        actionLocation: "table",
        cta: languageData["Merchant.ProductGroup.Add"],
        title: languageData["Merchant.ProductGroup.Add"],
        icon: Plus,
        content: (
          <SchemaForm<UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto>
            onSubmit={({ formData }) => {
              if (!formData) return;
              void postMerchantsByIdProductGroupsApi({
                id: partId,
                requestBody: [formData],
              }).then((res) => {
                handlePostResponse(res, router);
              });
            }}
            schema={
              $UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto
            }
            submitText={languageData.Save}
            uiSchema={createUiSchemaWithResource({
              schema:
                $UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto,
              resources: languageData,
              name: "Form.Merchant.productGroup",
              extend: {
                productGroupId: {
                  "ui:widget": "productGroup",
                },
                isDefault: {
                  "ui:widget": "switch",
                },
              },
            })}
            widgets={{
              productGroup:
                CustomComboboxWidget<UniRefund_SettingService_ProductGroups_ProductGroupDto>(
                  {
                    languageData,
                    list: productGroupsList,
                    selectIdentifier: "id",
                    selectLabel: "name",
                  },
                ),
            }}
          />
        ),
      },
    ],
    rowActions: [
      {
        type: "confirmation-dialog",
        actionLocation: "row",
        cta: languageData.Delete,
        title: languageData["Merchant.ProductGroup.Delete"],
        confirmationText: languageData.Delete,
        cancelText: languageData.Cancel,
        description: languageData["Merchant.ProductGroup.Delete.Description"],
        icon: Trash,
        onConfirm: (row) => {
          void deleteMerchantsByIdProductGroupsApi({
            id: partId,
            requestBody: [row.productGroupId],
          }).then((response) => {
            handleDeleteResponse(response, router);
          });
        },
      },
      {
        type: "confirmation-dialog",
        actionLocation: "row",
        cta: languageData["Merchant.ProductGroup.Default"],
        title: languageData["Merchant.ProductGroup.Default"],
        confirmationText: languageData.Save,
        cancelText: languageData.Cancel,
        description: languageData["Merchant.ProductGroup.Default.Description"],
        icon: Star,
        onConfirm: (row) => {
          void postMerchantsByIdProductGroupByProductGroupIdDefaultApi({
            id: partId,
            productGroupId: row.productGroupId,
          }).then((response) => {
            handlePostResponse(response, router);
          });
        },
      },
    ],
  };
  return table;
}
export const tableData = {
  productGroups: {
    columns: productGroupsColumns,
    table: productGroupsTable,
  },
};
