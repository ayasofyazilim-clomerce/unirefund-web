import type { UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as RebateTableHeaderDto } from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as $RebateTableHeaderDto } from "@ayasofyazilim/saas/ContractService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { CheckCircle, PlusCircle, XCircle } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

type RebateTableHeaders = TanstackTableCreationProps<RebateTableHeaderDto>;
const booleanOptions = {
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
};
const rebateTableHeadersColumns = (
  locale: string,
  languageData: ContractServiceResource,
) =>
  tanstackTableCreateColumnsByRowData<RebateTableHeaderDto>({
    rows: $RebateTableHeaderDto.properties,
    languageData: {
      constantKey: "Rebate.Form",
      languageData,
    },
    config: {
      locale,
    },
    links: {
      name: {
        prefix: `/settings/templates/rebate`,
        targetAccessorKey: "id",
      },
    },
    faceted: {
      calculateNetCommissionInsteadOfRefund: booleanOptions,
    },
    badges: {
      name: {
        values: [
          {
            label: languageData["Rebate.Form.isTemplate"] || "Template",
            conditions: [
              {
                conditionAccessorKey: "isTemplate",
                when: (value) => value === true,
              },
            ],
          },
        ],
      },
    },
  });

const rebateTableHeadersTable = (params: {
  languageData: ContractServiceResource;
  router: AppRouterInstance;
}) => {
  const table: RebateTableHeaders = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "calculateNetCommissionInsteadOfRefund"],
    },
    tableActions: [
      {
        actionLocation: "table",
        type: "simple",
        icon: PlusCircle,
        onClick: () => {
          params.router.push(`rebate/new`);
        },
        cta: params.languageData["Rebate.Create"],
      },
    ],
  };
  return table;
};

export const tableData = {
  rebateTableHeaders: {
    columns: rebateTableHeadersColumns,
    table: rebateTableHeadersTable,
  },
};
