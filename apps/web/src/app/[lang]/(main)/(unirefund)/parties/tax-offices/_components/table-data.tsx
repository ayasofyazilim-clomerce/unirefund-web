"use client";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import type {
  UniRefund_CRMService_TaxOffices_TaxOfficeListResponseDto as TaxOfficeListResponseDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeStatus as TaxOfficeStatus,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {$UniRefund_CRMService_TaxOffices_TaxOfficeListResponseDto as $TaxOfficeListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import type {
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
// import {isActionGranted} from "@repo/utils/policies";
import {Building2, PlusCircle, Store} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

type TaxOfficeTable = TanstackTableCreationProps<TaxOfficeListResponseDto>;

function taxOfficeTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  newLink: string,
) {
  const actions: TanstackTableTableActionsType<TaxOfficeListResponseDto>[] = [
    {
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      condition: () => true, // isActionGranted(["CRMService.TaxOffices.Create"], grantedPolicies),
      onClick() {
        router.push(newLink);
      },
    },
  ];
  return actions;
}

function taxOfficeColumns(locale: string, languageData: CRMServiceServiceResource) {
  const baseLink = getBaseLink("parties/tax-offices", locale);
  return tanstackTableCreateColumnsByRowData<TaxOfficeListResponseDto>({
    rows: $TaxOfficeListResponseDto.properties,
    languageData: {
      name: languageData.Name,
      typeCode: languageData["CRM.typeCode"],
      vatNumber: languageData["CRM.vatNumber"],
      externalStoreIdentifier: languageData["Form.TaxOffice.externalStoreIdentifier"],
    },
    config: {
      locale,
    },
    custom: {
      name: {
        showHeader: true,
        content: (row) => {
          return (
            <div className="flex items-center gap-2">
              <Link
                className="flex items-center gap-1 font-medium text-blue-700"
                href={`${baseLink}/${row.id}/details`}>
                {row.name}
              </Link>
              <BadgeByStatus languageData={languageData} status={row.status} />
            </div>
          );
        },
      },
      typeCode: {
        showHeader: true,
        content: (row) => {
          return (
            <div className="flex items-center gap-1 bg-transparent">
              {row.typeCode === "HEADQUARTER" && <Building2 className="size-4 text-gray-500" />}
              {row.typeCode === "TAXOFFICE" && <Store className="size-4 text-gray-500" />}
              {languageData[`Form.TaxOffice.typeCode.${row.typeCode}` as keyof typeof languageData]}
            </div>
          );
        },
      },
      parentId: {
        content: (row) => {
          return (
            <>
              {row.parentId ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Button asChild className="h-6 items-center p-1" size="sm" variant="outline">
                      <Link href={`${baseLink}/${row.parentId}/details`}>
                        <Building2 className="mr-1 size-4" />
                        {row.parentName}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{languageData["CRM.openHeadquarter"]}</TooltipContent>
                </Tooltip>
              ) : null}
            </>
          );
        },
      },
    },
  });
}

function taxOfficeTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  newLink: string,
) {
  const table: TaxOfficeTable = {
    fillerColumn: "name",
    tableActions: taxOfficeTableActions(languageData, router, grantedPolicies, newLink),
    filters: {
      textFilters: ["name"],
      facetedFilters: {
        typeCode: {
          title: languageData["CRM.typeCode"],
          options: [
            {
              label: languageData["Form.TaxOffice.typeCode.HEADQUARTER"],
              value: "HEADQUARTER",
              icon: Building2,
            },
            {
              label: languageData["Form.TaxOffice.typeCode.TAXOFFICE"],
              value: "TAXOFFICE",
              icon: Store,
            },
          ],
        },
      },
    },
    columnVisibility: {
      type: "hide",
      columns: ["id", "status", "parentName"],
    },
    columnOrder: ["name", "parentId", "typeCode", "externalStoreIdentifier", "vatNumber"],
  };
  return table;
}

export const tableData = {
  taxOffices: {
    columns: taxOfficeColumns,
    table: taxOfficeTable,
  },
};

function BadgeByStatus({
  status,
  languageData,
}: {
  status: TaxOfficeStatus | undefined;
  languageData: CRMServiceServiceResource;
}) {
  let className = "";
  if (!status) return null;
  switch (status) {
    case "ACTIVE":
      className = "!bg-green-100 text-xs text-green-600 border-green-500";
      break;
    case "INACTIVE":
      className = "!bg-red-100 text-xs text-red-600 border-red-500";
      break;
    case "APPROVED":
      className = "!bg-green-100 text-xs text-green-600 border-green-700";
      break;
    case "DRAFT":
      className = "!bg-gray-100 text-xs text-gray-600 border-gray-500";
      break;
    case "REJECTED":
      className = "!bg-yellow-100 text-xs text-yellow-600 border-yellow-500";
      break;
    case "SUSPENDED":
      className = "!bg-purple-100 text-xs text-purple-600 border-purple-700";
      break;
    case "WAITINGAPPROVAL":
      className = "!bg-orange-100 text-xs text-orange-600 border-orange-500";
  }
  return (
    <Badge className={cn("px-1", className)}>
      {languageData[`CRM.PartyStatus.${status}` as keyof typeof languageData]}
    </Badge>
  );
}
