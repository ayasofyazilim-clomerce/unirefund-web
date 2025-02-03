import type { UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as RebateTableHeaderDto } from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as $RebateTableHeaderDto } from "@ayasofyazilim/saas/ContractService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { CheckCircle, PlusCircle, XCircle } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

type RebateTableHeaders = TanstackTableCreationProps<RebateTableHeaderDto>;

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
        prefix: `/settings/templates/rebate-tables`,
        targetAccessorKey: "id",
      },
    },
    faceted: {
      calculateNetCommissionInsteadOfRefund: {
        options: [
          {
            when: (val) => val === true,
            label: "",
            value: "",
            icon: CheckCircle,
            iconClassName: "text-green-700",
          },
          {
            when: (val) => val === false,
            label: "",
            value: "",
            icon: XCircle,
            iconClassName: "text-red-700",
          },
        ],
      },
    },
    badges: {
      name: {
        values: [
          {
            position: "before",
            label: "Assigned",
            conditions: [
              {
                conditionAccessorKey: "isAssigned",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: "Template",
            conditions: [
              {
                conditionAccessorKey: "isTemplate",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: "Customized",
            conditions: [
              {
                conditionAccessorKey: "isCustomizedOverTemplate",
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
      columns: ["name", "creationTime", "lastModificationTime"],
    },
    columnOrder: ["name", "creationTime", "lastModificationTime"],
    tableActions: [
      {
        actionLocation: "table",
        type: "simple",
        icon: PlusCircle,
        onClick: () => {
          params.router.push(`rebate-tables/new`);
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
