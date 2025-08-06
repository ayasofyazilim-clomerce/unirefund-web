"use client";
import type {
  UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {
  $UniRefund_CRMService_Individuals_IndividualListResponseDto as $IndividualListResponseDto
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import type {
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
// import {isActionGranted} from "@repo/utils/policies";
import {PlusCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

type IndividualTable = TanstackTableCreationProps<IndividualListResponseDto>;

function individualTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  newLink: string,
) {
  const actions: TanstackTableTableActionsType<IndividualListResponseDto>[] = [
    {
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      condition: () => true, // isActionGranted(["CRMService.Individuals.Create"], grantedPolicies),
      onClick() {
        router.push(newLink);
      },
    },
  ];
  return actions;
}

function individualColumns(locale: string, languageData: CRMServiceServiceResource) {
  const baseLink = getBaseLink("parties/individuals", locale);
  return tanstackTableCreateColumnsByRowData<IndividualListResponseDto>({
    rows: $IndividualListResponseDto.properties,
    languageData: {
      firstname: `${languageData["Form.Individual.firstname"]  } ${  languageData["Form.Individual.lastname"]}`,
      lastname: languageData["Form.Individual.lastname"],
      gender: languageData["Form.Individual.gender"],
      identificationNumber: languageData["Form.Individual.identificationNumber"],
    },
    config: {
      locale,
    },
    custom: {
      firstname: {
        showHeader: true,
        content: (row) => {
          return (
            <div className="flex items-center gap-2">
              <Link
                className="flex items-center gap-1 font-medium text-blue-700"
                href={`${baseLink}/${row.id}/details`}>
                {row.firstname} {row.lastname}
              </Link>
            </div>
          );
        },
      },
      gender: {
        showHeader: true,
        content: (row) => {
          if (row.gender)
            return (
              <div className="flex items-center gap-2">
                <span>{languageData[`Form.Individual.gender.${row.gender}`]}</span>
              </div>
            );
          return <></>;
        },
      },
    },
  });
}

function individualTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  newLink: string,
) {
  const table: IndividualTable = {
    fillerColumn: "firstname",
    tableActions: individualTableActions(languageData, router, grantedPolicies, newLink),
    filters: {
      textFilters: ["firstname", "lastname"],
    },
    columnVisibility: {
      type: "hide",
      columns: ["id", "lastname"],
    },
    columnOrder: ["firstname"],
  };
  return table;
}

export const tableData = {
  individuals: {
    columns: individualColumns,
    table: individualTable,
  },
};
