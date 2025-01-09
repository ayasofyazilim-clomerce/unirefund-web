"use client";
import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_ContractsForMerchant_ContractSettings_ContractSettingDto as ContractSettingDto,
  UniRefund_ContractService_ContractsForMerchant_ContractStores_ContractStoreCreateAndUpdateDto as ContractStoreCreateAndUpdateDto,
  UniRefund_ContractService_ContractsForMerchant_ContractStores_ContractStoreDetailedDto as ContractStoreDetailedDto,
} from "@ayasofyazilim/saas/ContractService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { postMerchantContractHeaderContractStoresByHeaderIdApi } from "src/actions/unirefund/ContractService/post-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { tableData } from "./table-data";

export function ContractStoresTable({
  languageData,
  contractStores,
  contractSettings,
}: {
  languageData: ContractServiceResource;
  contractStores: ContractStoreDetailedDto[];
  contractSettings: ContractSettingDto[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { lang, contractId } = useParams<{
    lang: string;
    contractId: string;
  }>();
  const columns = tableData.columns({
    lang,
    languageData,
    contractSettings,
  });
  const table = tableData.table();
  const [updatedData, setUpdatedData] = useState<ContractStoreDetailedDto[]>(
    [],
  );
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <TanstackTable
        columns={columns}
        data={contractStores}
        editable
        onTableDataChange={(data) => {
          setUpdatedData(data);
        }}
        {...table}
      />
      <ConfirmDialog
        closeProps={{
          children: languageData.Cancel,
        }}
        confirmProps={{
          children: languageData.Save,
          onConfirm: () => {
            const mappedData: ContractStoreCreateAndUpdateDto[] =
              updatedData.map((item) => {
                return {
                  contractSettingId: item.contractSettingId || "",
                  receiptType: item.receiptType,
                  contractTypeIdentifiersSubId:
                    item.contractTypeIdentifiersSubId,
                };
              });
            setLoading(true);
            void postMerchantContractHeaderContractStoresByHeaderIdApi({
              id: contractId,
              requestBody: {
                contractStores: mappedData,
              },
            })
              .then((response) => {
                if (response.type === "success") {
                  toast.success(languageData["Contracts.Stores.Save.Success"]);
                  router.refresh();
                  setUpdatedData([]);
                } else {
                  toast.error(
                    response.message ||
                      languageData["Contracts.Stores.Save.Fail"],
                  );
                }
              })
              .finally(() => {
                setLoading(false);
              });
          },
          closeAfterConfirm: true,
        }}
        description={languageData["Contracts.Stores.Save.Description"]}
        loading={loading}
        title={languageData["Contracts.Stores.Save.Title"]}
        triggerProps={{
          className: "w-full max-w-lg",
          disabled: updatedData.length === 0 || loading,
          children: languageData.Save,
        }}
        type="with-trigger"
      />
    </div>
  );
}
