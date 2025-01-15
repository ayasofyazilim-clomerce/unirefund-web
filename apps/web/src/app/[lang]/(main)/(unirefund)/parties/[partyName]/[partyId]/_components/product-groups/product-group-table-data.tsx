import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/CRMService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {
  FieldConfigType,
  ZodObjectOrWrapped,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { PlusCircle } from "lucide-react";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { getBaseLink } from "src/utils";
import type { AutoFormValues } from "./table";

type ProductGroupsTable =
  TanstackTableCreationProps<UniRefund_SettingService_ProductGroups_ProductGroupDto>;

export function productGroupsColumns(
  languageData: CRMServiceServiceResource,
  locale: string,
) {
  return tanstackTableCreateColumnsByRowData<UniRefund_SettingService_ProductGroups_ProductGroupDto>(
    {
      languageData,
      rows: $UniRefund_SettingService_ProductGroups_ProductGroupDto.properties,
      links: {
        name: {
          prefix: getBaseLink("settings/product/product-groups"),
          targetAccessorKey: "id",
        },
      },
      config: {
        locale,
      },
    },
  );
}

function productGroupsTable(
  languageData: CRMServiceServiceResource,
  addProductGroupsFormSchema: ZodObjectOrWrapped,
  handleSubmit: (formData: AutoFormValues) => void,
  fieldConfig: FieldConfigType,
): ProductGroupsTable {
  const table: ProductGroupsTable = {
    fillerColumn: "name",
    columnOrder: ["name"],
    columnVisibility: {
      type: "hide",
      columns: ["id", "vatId"],
    },
    tableActions: [
      {
        type: "autoform-dialog",
        actionLocation: "table",
        cta: languageData["ProductGroups.Assign"],
        title: languageData["ProductGroups.Assign"],
        schema: addProductGroupsFormSchema,
        fieldConfig,
        icon: PlusCircle,
        onSubmit(values) {
          handleSubmit(values as AutoFormValues);
        },
        submitText: languageData.Save,
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
