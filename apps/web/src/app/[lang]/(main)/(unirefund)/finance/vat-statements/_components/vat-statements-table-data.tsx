import {Badge} from "@/components/ui/badge";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderForListDto} from "@repo/saas/FinanceService";
import {
  $PagedResultDto_VATStatementHeaderForListDto,
  $UniRefund_FinanceService_Enums_VATStatementStatus,
} from "@repo/saas/FinanceService";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {PackagePlus, PlusIcon} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {Localization} from "@/providers/tenant";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";

type VatStatementsTable =
  TanstackTableCreationProps<UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderForListDto>;

const links: Partial<
  Record<keyof UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderForListDto, TanstackTableColumnLink>
> = {};
const vatStatementsColumns = (
  localization: Localization,
  languageData: FinanceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["FinanceService.RebateStatementHeaders.View"], grantedPolicies)) {
    links.merchantId = {
      prefix: "vat-statements",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderForListDto>(
    {
      rows: $PagedResultDto_VATStatementHeaderForListDto.properties.items.items.properties,
      languageData: {
        languageData,
        constantKey: "Finance",
      },
      localization,
      links,
      custom: {
        merchantId: {
          showHeader: true,
          content: (row) => {
            const badgeClasses = {
              Paid: "text-green-500 bg-green-100 border-green-500",
              NotPaid: "text-red-500 bg-red-100 border-red-500",
              PartlyPaid: "text-orange-500 bg-orange-100 border-orange-500",
              OverPaid: "text-green-800 bg-orange-100 border-green-500",
            };
            return (
              <div className="flex items-center gap-1">
                <Badge className={badgeClasses[row.paymentStatus]}>
                  {languageData[`Finance.paymentStatus.${row.paymentStatus}`]}
                </Badge>
                {row.merchantName}
              </div>
            );
          },
        },
        totalAmount: {
          showHeader: true,
          content: (row) => {
            return (
              <div>
                {row.totalAmount} {row.currency}
              </div>
            );
          },
        },
        unpaidAmount: {
          showHeader: true,
          content: (row) => {
            return (
              <div>
                {row.unpaidAmount} {row.currency}
              </div>
            );
          },
        },
      },
      faceted: {
        status: {
          options: $UniRefund_FinanceService_Enums_VATStatementStatus.enum.map((x) => ({
            label: languageData[`Finance.status.${x}`],
            value: x,
          })),
        },
      },
    },
  );
};

function vatStatementTableActions(
  languageData: FinanceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderForListDto>[] =
    [
      {
        type: "simple",
        cta: languageData["Finance.vatStatements.new"],
        icon: PlusIcon,
        actionLocation: "table",
        condition: () => isActionGranted(["FinanceService.VATStatementHeaders.Create"], grantedPolicies),
        onClick: () => {
          router.push("vat-statements/new");
        },
      },
      {
        type: "simple",
        cta: languageData["Finance.vatStatements.bulk"],
        icon: PackagePlus,
        actionLocation: "table",
        condition: () => isActionGranted(["FinanceService.VATStatementHeaders.Create"], grantedPolicies),
        onClick: () => {
          router.push("vat-statements/bulk");
        },
      },
    ];
  return actions;
}

function vatStatementsTable(
  languageData: FinanceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: VatStatementsTable = {
    tableActions: vatStatementTableActions(languageData, router, grantedPolicies),
    fillerColumn: "merchantId",
    columnVisibility: {
      type: "hide",
      columns: ["id", "merchantName", "paymentStatus", "currency", "rebateStatementHeaderId"],
    },
    columnOrder: [
      "merchantId",
      "invoiceNumber",
      "tagCount",
      "vatStatementDate",
      "dueDate",
      "totalAmount",
      "unpaidAmount",
      "status",
    ],
  };
  return table;
}

export const tableData = {
  vatStatements: {
    columns: vatStatementsColumns,
    table: vatStatementsTable,
  },
};
