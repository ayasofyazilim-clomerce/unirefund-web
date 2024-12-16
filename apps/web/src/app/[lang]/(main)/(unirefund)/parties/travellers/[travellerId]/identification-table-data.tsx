import type { UniRefund_TravellerService_PersonalIdentificationCommonDatas_PersonalIdentificationProfileDto } from "@ayasofyazilim/saas/TravellerService";
import { $UniRefund_TravellerService_PersonalIdentificationCommonDatas_PersonalIdentificationProfileDto } from "@ayasofyazilim/saas/TravellerService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { PlusCircle } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { TravellerServiceResource } from "src/language-data/unirefund/TravellerService";
import type { Policy } from "src/utils/page-policy/utils";

type IdentificationsTable =
  TanstackTableCreationProps<UniRefund_TravellerService_PersonalIdentificationCommonDatas_PersonalIdentificationProfileDto>;

const links: Partial<
  Record<
    keyof UniRefund_TravellerService_PersonalIdentificationCommonDatas_PersonalIdentificationProfileDto,
    TanstackTableColumnLink
  >
> = {};

function identificationsTableActions(
  languageData: TravellerServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  travellerId: string,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (
    isActionGranted(["TravellerService.Travellers.Create"], grantedPolicies)
  ) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Travellers.New.Identification"],
      icon: PlusCircle,
      onClick() {
        router.push(`${travellerId}/identification/new`);
      },
    });
  }
  return actions;
}
function identificationsColumns(
  locale: string,
  languageData: TravellerServiceResource,
  grantedPolicies: Record<Policy, boolean>,
  travellerId: string,
) {
  if (isActionGranted(["TravellerService.Travellers.Edit"], grantedPolicies)) {
    links.travelDocumentNumber = {
      prefix: `${travellerId}/identification/`,
      targetAccessorKey: "id",
    };
  }

  return tanstackTableCreateColumnsByRowData<UniRefund_TravellerService_PersonalIdentificationCommonDatas_PersonalIdentificationProfileDto>(
    {
      rows: $UniRefund_TravellerService_PersonalIdentificationCommonDatas_PersonalIdentificationProfileDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.personalIdentification",
      },
      config: {
        locale,
      },
      links,
    },
  );
}

export function identificationsTable(
  languageData: TravellerServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  travellerId: string,
): IdentificationsTable {
  const table: IdentificationsTable = {
    fillerColumn: "travelDocumentNumber",
    columnVisibility: {
      type: "hide",
      columns: [
        "id",
        "nationalityCountryCode2",
        "residenceCountryCode2",
        "fullName",
      ],
    },
    tableActions: identificationsTableActions(
      languageData,
      router,
      grantedPolicies,
      travellerId,
    ),
    columnOrder: [
      "travelDocumentNumber",
      "firstName",
      "middleName",
      "lastName",
      "nationalityCountryName",
      "residenceCountryName",
      "birthDate",
      "issueDate",
      "expirationDate",
      "identificationType",
    ],
    pinColumns: ["travelDocumentNumber"],
  };
  return table;
}

export const tableData = {
  identifications: {
    columns: identificationsColumns,
    table: identificationsTable,
  },
};
