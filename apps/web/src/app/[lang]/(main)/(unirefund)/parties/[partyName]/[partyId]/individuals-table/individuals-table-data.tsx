import type { UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto } from "@ayasofyazilim/saas/CRMService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {
  FieldConfigType,
  ZodObjectOrWrapped,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { PlusCircle } from "lucide-react";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { AutoFormValues } from "./table";

type IndividualsTable =
  TanstackTableCreationProps<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>;

export function individualsColumns(
  languageData: CRMServiceServiceResource,
  locale: string,
) {
  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>(
    {
      languageData,
      rows: $UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto.properties,
      config: {
        locale,
      },
    },
  );
}

function individualsTable(
  languageData: CRMServiceServiceResource,
  addAffilationsFormSchema: ZodObjectOrWrapped,
  handleSubmit: (formData: AutoFormValues) => Promise<void>,
  fieldConfig: FieldConfigType,
): IndividualsTable {
  const table: IndividualsTable = {
    fillerColumn: "name",
    columnOrder: ["name"],
    columnVisibility: {
      type: "show",
      columns: ["name", "codeName"],
    },
    tableActions: [
      {
        type: "autoform-dialog",
        actionLocation: "table",
        cta: languageData["Individuals.New"],
        title: languageData["Individuals.New"],
        schema: addAffilationsFormSchema,
        fieldConfig,
        icon: PlusCircle,
        onSubmit(values) {
          void handleSubmit(values as AutoFormValues);
        },
        submitText: languageData.Save,
      },
    ],
  };
  return table;
}
export const tableData = {
  individuals: {
    columns: individualsColumns,
    table: individualsTable,
  },
};
