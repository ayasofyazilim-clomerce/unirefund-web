import type {
  UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto,
  UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto,
  $UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto,
} from "@repo/saas/CRMService";
import type {UniRefund_SettingService_ProductGroups_ProductGroupDto} from "@ayasofyazilim/saas/SettingService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {CheckCircle, Plus, Star, Trash, XCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {handleDeleteResponse, handlePostResponse} from "@repo/utils/api";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {deleteMerchantProductGroupsByMerchantIdApi} from "@repo/actions/unirefund/CrmService/delete-actions";
import {
  postMerchantProductGroupByProductGroupIdDefaultApi,
  postMerchantProductGroupsApi,
} from "@repo/actions/unirefund/CrmService/post-actions";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

type ProductGroupsTable =
  TanstackTableCreationProps<UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto>;

function productGroupsTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  productGroupsList: UniRefund_SettingService_ProductGroups_ProductGroupDto[],
  partyId: string,
) {
  const actions: TanstackTableTableActionsType<UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto>[] =
    [];
  if (isActionGranted(["SettingService.ProductGroupMerchants.Add"], grantedPolicies)) {
    actions.push({
      type: "custom-dialog",
      actionLocation: "table",
      cta: languageData["Form.Merchant.productGroup.create"],
      title: languageData["Form.Merchant.productGroup.create"],
      icon: Plus,
      content: (
        <SchemaForm<UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto>
          onSubmit={({formData}) => {
            if (!formData) return;
            void postMerchantProductGroupsApi({
              merchantId: partyId,
              requestBody: [formData],
            }).then((res) => {
              handlePostResponse(res, router);
            });
          }}
          schema={$UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto}
          submitText={languageData.Save}
          uiSchema={createUiSchemaWithResource({
            schema: $UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantBaseDto,
            resources: languageData,
            name: "Form.Merchant.productGroup",
            extend: {
              "ui:className": "border-0 p-0",
              displayLabel: false,
              productGroupId: {
                "ui:widget": "productGroup",
              },
              isDefault: {
                "ui:widget": "switch",
                "ui:className": "px-2 border rounded-md",
              },
            },
          })}
          widgets={{
            productGroup: CustomComboboxWidget<UniRefund_SettingService_ProductGroups_ProductGroupDto>({
              languageData,
              customItemRenderer: (value) => ProductGroupListItem(value, languageData),
              list: productGroupsList,
              selectIdentifier: "id",
              selectLabel: "name",
            }),
          }}
          withScrollArea={false}
        />
      ),
    });
  }
  return actions;
}
function ProductGroupListItem(
  value: UniRefund_SettingService_ProductGroups_ProductGroupDto,
  languageData: CRMServiceServiceResource,
) {
  return (
    <div className="flex w-full items-center justify-between">
      {value.name}
      <Badge className={cn(value.active ? "text-green-500" : "text-muted-foreground")} variant="outline">
        {value.active
          ? languageData["Form.Merchant.productGroup.active"]
          : languageData["Form.Merchant.productGroup.inactive"]}
      </Badge>
    </div>
  );
}
function productGroupsRowActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  partyId: string,
) {
  const actions: TanstackTableRowActionsType<UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto>[] =
    [];
  if (isActionGranted(["SettingService.ProductGroupMerchants.Edit"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      actionLocation: "row",
      cta: languageData["Form.Merchant.productGroup.default"],
      title: languageData["Form.Merchant.productGroup.default"],
      condition: (row) => !row.isDefault,
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description: languageData["Form.Merchant.productGroup.default.description"],
      icon: Star,
      onConfirm: (row) => {
        void postMerchantProductGroupByProductGroupIdDefaultApi({
          merchantId: partyId,
          productGroupId: row.productGroupId,
        }).then((response) => {
          handlePostResponse(response, router);
        });
      },
    });
  }
  if (isActionGranted(["SettingService.ProductGroupMerchants.Delete"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      actionLocation: "row",
      cta: languageData.Delete,
      title: languageData["Form.Merchant.productGroup.delete"],
      confirmationText: languageData.Delete,
      cancelText: languageData.Cancel,
      description: languageData["Form.Merchant.productGroup.delete.confirm"],
      icon: Trash,
      onConfirm: (row) => {
        void deleteMerchantProductGroupsByMerchantIdApi({
          merchantId: partyId,
          productGroupIds: [row.productGroupId],
        }).then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    });
  }
  return actions;
}

export function productGroupsColumns(
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
  locale: string,
) {
  const links: Partial<
    Record<
      keyof UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto,
      TanstackTableColumnLink
    >
  > = {};
  if (isActionGranted(["SettingService.ProductGroups.Edit"], grantedPolicies)) {
    links.productGroupName = {
      prefix: "/settings/product/product-groups",
      targetAccessorKey: "productGroupId",
    };
    links.vatRate = {
      prefix: "/settings/product/vats",
      targetAccessorKey: "vatId",
    };
  }

  return tanstackTableCreateColumnsByRowData<UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto>(
    {
      rows: $UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.Merchant.productGroup",
      },
      links,
      config: {
        locale,
      },
      faceted: {
        isActive: {
          options: [
            {
              label: "Yes",
              when: (value) => {
                return Boolean(value);
              },
              value: "true",
              icon: CheckCircle,
              iconClassName: "text-green-700",
              hideColumnValue: true,
            },
            {
              label: "No",
              when: (value) => {
                return !value;
              },
              value: "false",
              icon: XCircle,
              iconClassName: "text-red-700",
              hideColumnValue: true,
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
  partyId: string,
  grantedPolicies: Record<Policy, boolean>,
): ProductGroupsTable {
  const table: ProductGroupsTable = {
    fillerColumn: "productGroupName",
    columnVisibility: {
      type: "hide",
      columns: ["isAssign", "isDefault", "productGroupId", "vatId"],
    },
    columnOrder: ["productGroupName", "vatRate", "isActive"],
    tableActions: productGroupsTableActions(languageData, router, grantedPolicies, productGroupsList, partyId),
    rowActions: productGroupsRowActions(languageData, router, grantedPolicies, partyId),
  };
  return table;
}
export const tableData = {
  productGroups: {
    columns: productGroupsColumns,
    table: productGroupsTable,
  },
};
