import {OpenInNewWindowIcon} from "@radix-ui/react-icons";
import type {
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData as columnsByData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderDetailForMerchantDto as ContractsForMerchantDto} from "@repo/saas/ContractService";
import {$UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderDetailForMerchantDto as $ContractsForMerchantDto} from "@repo/saas/ContractService";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import {getBaseLink} from "src/utils";

const contractsTableColumns = ({
  languageData,
  lang,
  partyId,
}: {
  languageData: CRMServiceServiceResource & ContractServiceResource;
  lang: string;
  partyId: string;
}) => {
  return columnsByData<ContractsForMerchantDto>({
    rows: $ContractsForMerchantDto.properties,
    config: {locale: lang},
    languageData: {
      constantKey: "Contracts",
      languageData,
    },
    badges: {
      name: {
        values: [
          {
            label: languageData["Contracts.Draft"],
            conditions: [
              {
                when: (value) => value === true,
                conditionAccessorKey: "isDraft",
              },
            ],
          },
          {
            label: languageData["Contracts.Active"],
            conditions: [
              {
                when: (value) => value === true,
                conditionAccessorKey: "isActive",
              },
            ],
          },
        ],
      },
    },
    links: {
      name: {
        prefix: `/parties/merchants/${partyId}/contracts`,
        targetAccessorKey: "id",
        suffix: "contract",
      },
    },
    icons: {
      name: {
        icon: OpenInNewWindowIcon,
        position: "before",
      },
    },
  });
};

const contractsTable = (props: {
  languageData: CRMServiceServiceResource & ContractServiceResource;
  partyId: string;
  router: AppRouterInstance;
  grantedPolicies: Record<Policy, boolean>;
}) => {
  const {languageData, partyId, router} = props;
  const actions: TanstackTableTableActionsType<ContractsForMerchantDto>[] = [];
  const canCreate = isActionGranted(["ContractService.ContractHeaderForRefundPoint.Create"], props.grantedPolicies);
  if (canCreate) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      onClick: () => {
        router.push(getBaseLink(`/parties/merchants/${partyId}/contracts/new/`));
      },
    });
  }
  // actions.push({
  //   type: "simple",
  //   actionLocation: "table",
  //   cta: languageData.ExportCSV,
  //   onClick: () => {
  //     toast.warning("Not implemented yet");
  //   },
  // });
  const table: TanstackTableCreationProps<ContractsForMerchantDto> = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "validFrom", "validTo"],
    },
    tableActions: actions,
  };
  return table;
};

export const tableData = {
  columns: contractsTableColumns,
  table: contractsTable,
};
