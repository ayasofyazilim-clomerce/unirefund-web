import type {UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderForListDto} from "@repo/saas/FinanceService";
import {
  $UniRefund_ContractService_Enums_RebateStatementPeriod,
  $UniRefund_FinanceService_Enums_RebateStatementStatus,
  $UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderForListDto,
} from "@repo/saas/FinanceService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {PlusIcon} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import type {Localization} from "@/providers/tenant";

type RebateStatementsTable =
  TanstackTableCreationProps<UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderForListDto>;

const links: Partial<
  Record<keyof UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderForListDto, TanstackTableColumnLink>
> = {};
const rebateStatementsColumns = (
  localization: Localization,
  languageData: FinanceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["FinanceService.RebateStatementHeaders.Edit"], grantedPolicies)) {
    links.merchantName = {
      prefix: "rebate-statements",
      targetAccessorKey: "id",
      suffix: "/information",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderForListDto>(
    {
      rows: $UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderForListDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.RebateStatement",
      },
      localization,
      links,
      faceted: {
        status: {
          options: $UniRefund_FinanceService_Enums_RebateStatementStatus.enum.map((x) => ({
            label: languageData[`Form.RebateStatement.status.${x}`],
            value: x,
          })),
        },
        period: {
          options: $UniRefund_ContractService_Enums_RebateStatementPeriod.enum.map((x) => ({
            label: languageData[`Form.RebateStatement.period.${x}`],
            value: x,
          })),
        },
      },
    },
  );
};

function rebateStatementTableActions(
  languageData: FinanceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderForListDto>[] =
    [];
  if (isActionGranted(["FinanceService.RebateStatementHeaders.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      cta: languageData["RebateStatement.New"],
      icon: PlusIcon,
      actionLocation: "table",
      onClick: () => {
        router.push("rebate-statements/new");
      },
    });
  }
  return actions;
}

function rebateStatementsTable(
  languageData: FinanceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: RebateStatementsTable = {
    tableActions: rebateStatementTableActions(languageData, router, grantedPolicies),
    fillerColumn: "merchantName",
    columnVisibility: {
      type: "hide",
      columns: ["id", "merchantId"],
    },
    columnOrder: ["merchantName", "number", "rebateStatementDate", "totalAmount", "period", "status"],
  };
  return table;
}

export const tableData = {
  rebateStatements: {
    columns: rebateStatementsColumns,
    table: rebateStatementsTable,
  },
};
