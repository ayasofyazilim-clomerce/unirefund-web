import type { UniRefund_FinanceService_Billings_BillingDto } from "@ayasofyazilim/saas/FinanceService";
import { $PagedResultDto_BillingDto } from "@ayasofyazilim/saas/FinanceService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { Trash } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { handleDeleteResponse } from "src/actions/core/api-utils-client";
import { deleteBillingApi } from "src/actions/unirefund/FinanceService/actions";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";

type BillingTable =
  TanstackTableCreationProps<UniRefund_FinanceService_Billings_BillingDto>;

const billingColumns = (locale: string, languageData: FinanceServiceResource) =>
  tanstackTableCreateColumnsByRowData<UniRefund_FinanceService_Billings_BillingDto>(
    {
      rows: $PagedResultDto_BillingDto.properties.items.items.properties,
      languageData: {
        languageData: languageData as Record<string, string>,
        constantKey: "Form",
      },
      config: {
        locale,
      },

      links: {
        merchantName: {
          prefix: "billing",
          targetAccessorKey: "id",
        },
      },
      badges: {
        merchantName: {
          values:
            $PagedResultDto_BillingDto.properties.items.items.properties.paymentStatus.enum.map(
              (status) => {
                const badgeClasses = {
                  PAID: "text-green-500 bg-green-100 border-green-500",
                  NOTPAID: "text-red-500 bg-red-100 border-red-500",
                  PARTIALLYPAID:
                    "text-orange-500 bg-orange-100 border-orange-500",
                };
                return {
                  label: languageData[`Form.paymentStatus.${status}`],
                  badgeClassName: badgeClasses[status],
                  conditions: [
                    {
                      conditionAccessorKey: "paymentStatus",
                      when: (value) => value === status,
                    },
                  ],
                };
              },
            ),
        },
      },
      faceted: {
        period: {
          options:
            $PagedResultDto_BillingDto.properties.items.items.properties.period.enum.map(
              (x) => ({
                label: languageData[`Form.period.${x}`],
                value: x,
              }),
            ),
        },
        status: {
          options:
            $PagedResultDto_BillingDto.properties.items.items.properties.status.enum.map(
              (x) => ({
                label: languageData[`Form.status.${x}`],
                value: x,
              }),
            ),
        },
      },
    },
  );

const billingTable = (
  router: AppRouterInstance,
  languageData: FinanceServiceResource,
) => {
  const table: BillingTable = {
    fillerColumn: "merchantName",
    columnVisibility: {
      type: "hide",
      columns: ["id", "merchantId", "paymentStatus"],
    },
    tableActions: [
      {
        type: "simple",
        actionLocation: "table",
        cta: languageData["Billing.New"],
        onClick: () => {
          router.push(`billing/new`);
        },
      },
    ],
    rowActions: [
      {
        actionLocation: "row",
        type: "confirmation-dialog",
        cta: languageData.Delete,
        confirmationText: languageData.Delete,
        cancelText: languageData.Cancel,
        description: languageData["Delete.Assurance"],
        icon: Trash,
        onConfirm: (row) => {
          void deleteBillingApi(row.id || "").then((response) => {
            handleDeleteResponse(response, router);
          });
        },
        title: languageData["Billing.Delete"],
      },
    ],
  };
  return table;
};

export const tableData = {
  billing: {
    columns: billingColumns,
    table: billingTable,
  },
};
