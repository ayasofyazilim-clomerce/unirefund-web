import type {UniRefund_TravellerService_Travellers_TravellerListDto} from "@repo/saas/TravellerService";
import {$UniRefund_TravellerService_Travellers_TravellerListDto} from "@repo/saas/TravellerService";
import type {
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {PlusCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {CountryDto} from "@/utils/address-hook/types";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";

type TravellersTable = TanstackTableCreationProps<UniRefund_TravellerService_Travellers_TravellerListDto>;

function travellersTableActions(
  languageData: TravellerServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<UniRefund_TravellerService_Travellers_TravellerListDto>[] = [
    {
      type: "simple",
      actionLocation: "table",
      cta: languageData["Travellers.New"],
      icon: PlusCircle,
      condition: () => isActionGranted(["TravellerService.Travellers.Create"], grantedPolicies),
      onClick() {
        router.push("travellers/new");
      },
    },
  ];
  return actions;
}
function travellersColumns(
  locale: string,
  languageData: TravellerServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  return tanstackTableCreateColumnsByRowData<UniRefund_TravellerService_Travellers_TravellerListDto>({
    rows: $UniRefund_TravellerService_Travellers_TravellerListDto.properties,
    languageData: {
      languageData,
      constantKey: "Form",
    },
    config: {
      locale,
    },
    links: {
      fullName: {
        prefix: "/parties/travellers",
        targetAccessorKey: "id",
        conditions: [
          {
            when: () => isActionGranted(["TravellerService.Travellers.Edit"], grantedPolicies),
            conditionAccessorKey: "fullName",
          },
        ],
      },
    },
    custom: {
      gender: {
        showHeader: true,
        content: (row) => languageData[`Form.gender.${row.gender}` as keyof typeof languageData] || "",
      },
      identificationType: {
        showHeader: true,
        content: (row) =>
          languageData[`Form.identificationType.${row.identificationType}` as keyof typeof languageData] || "",
      },
    },
  });
}

export function travellersTable(
  languageData: TravellerServiceResource,
  router: AppRouterInstance,
  countryList: CountryDto[],
  grantedPolicies: Record<Policy, boolean>,
): TravellersTable {
  const table: TravellersTable = {
    fillerColumn: "fullName",
    columnVisibility: {
      type: "hide",
      columns: ["id", "firstName", "lastName", "hasUserAccount", "nationalityCountryCode2", "userAccountId"],
    },
    tableActions: travellersTableActions(languageData, router, grantedPolicies),
    columnOrder: ["fullName", "nationalityCountryName", "birthDate", "identificationType"],
    pinColumns: ["fullName"],
    filters: {
      filterTitles: {
        travelDocumentNumber: languageData["Form.travelDocumentNumber"],
      },
      textFilters: ["fullName", "travelDocumentNumber"],
      facetedFilters: {
        nationalities: {
          title: languageData.Nationalities,
          options: countryList.map((x) => ({
            label: x.name,
            value: x.code2,
          })),
        },
        residences: {
          title: languageData.Residences,
          options: countryList.map((x) => ({
            label: x.name,
            value: x.code2,
          })),
        },
        showExpired: {
          title: languageData["Travellers.ShowExpired"],
          options: [
            {label: languageData.Yes, value: "true"},
            {label: languageData.No, value: "false"},
          ],
        },
      },
    },
  };
  return table;
}

export const tableData = {
  travellers: {
    columns: travellersColumns,
    table: travellersTable,
  },
};
