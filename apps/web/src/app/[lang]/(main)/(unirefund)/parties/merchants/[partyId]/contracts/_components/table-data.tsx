import { toast } from "@/components/ui/sonner";
import type { UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderDetailForMerchantDto as ContractsForMerchantDto } from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderDetailForMerchantDto as $ContractsForMerchantDto } from "@ayasofyazilim/saas/ContractService";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData as columnsByData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { getBaseLink } from "src/utils";

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
    config: { locale: lang },
    languageData: {
      constantKey: "Contracts",
      languageData,
    },
    badges: {
      name: {
        values: [
          {
            label: languageData["Contracts.draft"],
            conditions: [
              {
                when: (value) => value === true,
                conditionAccessorKey: "isDraft",
              },
            ],
          },
          {
            label: languageData["Contracts.active"],
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
}) => {
  const { languageData, partyId, router } = props;
  const table: TanstackTableCreationProps<ContractsForMerchantDto> = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "validFrom", "validTo"],
    },
    tableActions: [
      {
        type: "simple",
        actionLocation: "table",
        cta: languageData["Contracts.New"],
        onClick: () => {
          router.push(
            getBaseLink(`/parties/merchants/${partyId}/contracts/new/`),
          );
        },
      },
      {
        type: "simple",
        actionLocation: "table",
        cta: languageData.ExportCSV,
        onClick: () => {
          toast.warning("Not implemented yet");
        },
      },
    ],
  };
  return table;
};

export const tableData = {
  columns: contractsTableColumns,
  table: contractsTable,
};
