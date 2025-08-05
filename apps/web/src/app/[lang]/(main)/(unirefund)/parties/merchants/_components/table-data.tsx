"use client";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import {getBaseLink} from "@/utils";
import {
  $UniRefund_CRMService_Merchants_MerchantListResponseDto as $MerchantListResponseDto,
  UniRefund_CRMService_Merchants_MerchantListResponseDto as MerchantListResponseDto,
  UniRefund_CRMService_Merchants_MerchantStatus as MerchantStatus,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
// import {isActionGranted} from "@repo/utils/policies";
import {Building2, HousePlus, PlusCircle, Store, User} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

type MerchantTable = TanstackTableCreationProps<MerchantListResponseDto>;

function merchantTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  newLink: string,
) {
  const actions: TanstackTableTableActionsType<MerchantListResponseDto>[] = [
    {
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      condition: () => true, // isActionGranted(["CRMService.Merchants.Create"], grantedPolicies),
      onClick() {
        router.push(newLink);
      },
    },
  ];
  return actions;
}

function merchantColumns(locale: string, languageData: CRMServiceServiceResource) {
  const baseLink = getBaseLink("parties/merchants", locale);
  return tanstackTableCreateColumnsByRowData<MerchantListResponseDto>({
    rows: $MerchantListResponseDto.properties,
    languageData: {
      name: languageData["Form.Merchant.name"],
      typeCode: languageData["Form.Merchant.typeCode"],
      vatNumber: languageData["Form.Merchant.vatNumber"],
      externalStoreIdentifier: languageData["Form.Merchant.externalStoreIdentifier"],
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
                href={`${baseLink}/${row.id}/details`}
                className="flex items-center gap-1 font-medium text-blue-700">
                {row.name}
                {row.isPersonalCompany && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="outline" className="size-6 p-1" asChild>
                        <User className="size-4 text-blue-700" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{languageData["Merchant.personalCompany"]}</TooltipContent>
                  </Tooltip>
                )}
              </Link>
              <BadgeByStatus status={row.status} languageData={languageData} />
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
              {row.typeCode === "STORE" && <Store className="size-4 text-gray-500" />}
              {row.typeCode === "FRANCHISE" && <HousePlus className="size-4 text-gray-500" />}
              {languageData[("MerchantTypeCode." + row.typeCode) as keyof typeof languageData]}
            </div>
          );
        },
      },
      parentId: {
        content: (row) => {
          return (
            <>
              {row.parentId && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="sm" className="h-6 items-center p-1" asChild>
                      <Link href={`${baseLink}/${row.parentId}/details`}>
                        <Building2 className="mr-1 size-4" />
                        {row.parentName}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{languageData["CRM.openHeadquarter"]}</TooltipContent>
                </Tooltip>
              )}
            </>
          );
        },
      },
    },
  });
}

function merchantTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  newLink: string,
) {
  const table: MerchantTable = {
    fillerColumn: "name",
    tableActions: merchantTableActions(languageData, router, grantedPolicies, newLink),
    filters: {
      textFilters: ["name"],
      facetedFilters: {
        typeCode: {
          title: languageData["CRM.typeCode"],
          options: [
            {
              label: languageData["MerchantTypeCode.HEADQUARTER"],
              value: "HEADQUARTER",
              icon: Building2,
            },
            {
              label: languageData["MerchantTypeCode.STORE"],
              value: "STORE",
              icon: Store,
            },
            {
              label: languageData["MerchantTypeCode.FRANCHISE"],
              value: "FRANCHISE",
              icon: HousePlus,
            },
          ],
        },
      },
    },
    columnVisibility: {
      type: "hide",
      columns: ["id", "chainCodeId", "status", "parentName", "isPersonalCompany"],
    },
    columnOrder: ["name", "parentId", "typeCode", "externalStoreIdentifier", "vatNumber"],
  };
  return table;
}

export const tableData = {
  merchants: {
    columns: merchantColumns,
    table: merchantTable,
  },
};

function BadgeByStatus({
  status,
  languageData,
}: {
  status: MerchantStatus | undefined;
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
      {languageData[("CRM.PartyStatus." + status) as keyof typeof languageData]}
    </Badge>
  );
}
