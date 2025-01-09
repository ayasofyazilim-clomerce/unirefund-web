import type {
  UniRefund_ContractService_ContractsForMerchant_ContractStores_ContractStoreDetailedDto as ContractStoreDetailedDto,
  UniRefund_ContractService_ContractsForMerchant_ContractSettings_ContractSettingDto as ContractSettingDto,
} from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_ContractsForMerchant_ContractStores_ContractStoreDetailedDto as $ContractStoreDetailedDto } from "@ayasofyazilim/saas/ContractService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

const contractStoresTableColumns = ({
  languageData,
  lang,
  contractSettings,
}: {
  languageData: ContractServiceResource;
  contractSettings: ContractSettingDto[];
  lang: string;
}) => {
  return tanstackTableEditableColumnsByRowData<ContractStoreDetailedDto>({
    rows: {
      ...$ContractStoreDetailedDto.properties,
      contractSettingId: {
        type: "enum",
        enum: contractSettings.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      },
      receiptType: {
        type: "enum",
        enum: $ContractStoreDetailedDto.properties.receiptType.enum.map(
          (item) => {
            return {
              label: languageData[`Contracts.Stores.receiptType.${item}`],
              value: item,
            };
          },
        ),
      },
    },
    classNames: {
      name: [
        {
          className: "px-4",
        },
      ],
      fullAddress: [
        {
          className: "px-4",
        },
      ],
      manager: [
        {
          className: "px-4",
        },
      ],
    },
    config: {
      locale: lang,
    },
    languageData: {
      languageData,
      constantKey: "Contracts.Stores",
    },
    editableColumns: ["receiptType", "contractSettingId"],
  });
};

const contractsTable = () => {
  const table: TanstackTableCreationProps<ContractStoreDetailedDto> = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: [
        "name",
        "fullAddress",
        "manager",
        "contractSettingId",
        "receiptType",
      ],
    },
  };
  return table;
};

export const tableData = {
  columns: contractStoresTableColumns,
  table: contractsTable,
};
