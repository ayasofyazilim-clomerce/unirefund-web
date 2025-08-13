import type {UniRefund_CRMService_RefundPoints_RefundPointProfileDto} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_RefundPoints_RefundPointProfileDto} from "@ayasofyazilim/saas/CRMService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {Building2, PlusCircle, Store} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

type RefundPointsTable = TanstackTableCreationProps<UniRefund_CRMService_RefundPoints_RefundPointProfileDto>;

const links: Partial<Record<keyof UniRefund_CRMService_RefundPoints_RefundPointProfileDto, TanstackTableColumnLink>> =
  {};

function refundPointsTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<UniRefund_CRMService_RefundPoints_RefundPointProfileDto>[] = [];
  if (isActionGranted(["CRMService.RefundPoints.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      onClick() {
        router.push("refund-points/new");
      },
    });
  }
  return actions;
}

function refundPointsColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted(["CRMService.RefundPoints.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "/parties/refund-points",
      targetAccessorKey: "id",
      suffix: "details/info",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_RefundPoints_RefundPointProfileDto>({
    rows: $UniRefund_CRMService_RefundPoints_RefundPointProfileDto.properties,
    languageData: {
      name: languageData.Name,
    },
    config: {
      locale,
    },
    links,
  });
}
function refundPointsTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: RefundPointsTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "hide",
      columns: ["id", "organizationId", "parentId", "taxOfficeId"],
    },
    tableActions: refundPointsTableActions(languageData, router, grantedPolicies),
    columnOrder: ["name"],
    filters: {
      textFilters: ["name"],
      facetedFilters: {
        typeCode: {
          title: languageData["Parties.Type"],
          options: [
            {
              label: "Headquarter",
              value: "HEADQUARTER",
              icon: Building2,
            },
            {
              label: "Refund Point",
              value: "REFUNDPOINT",
              icon: Store,
            },
          ],
        },
      },
    },
  };
  return table;
}

export const tableData = {
  refundPoints: {
    columns: refundPointsColumns,
    table: refundPointsTable,
  },
};
