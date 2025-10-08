"use client";
import {toast} from "@/components/ui/sonner";
import {postMerchantContractHeaderContractStoresByHeaderIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {
  UniRefund_ContractService_ContractsForMerchant_ContractSettings_ContractSettingDto as ContractSettingDto,
  UniRefund_ContractService_ContractsForMerchant_ContractStores_ContractStoreCreateAndUpdateDto as ContractStoreCreateAndUpdateDto,
  UniRefund_ContractService_ContractsForMerchant_ContractStores_ContractStoreDetailedDto as ContractStoreDetailedDto,
} from "@repo/saas/ContractService";
import {useParams, useRouter} from "next/navigation";
import {useState} from "react";
import {useGrantedPolicies} from "@repo/utils/policies";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {useTenant} from "@/providers/tenant";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import {checkIsFormReady} from "../../../_components/utils";
import {tableData} from "./table-data";

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
  const {contractId, lang} = useParams<{
    contractId: string;
    lang: string;
  }>();
  const {localization} = useTenant();
  const columns = tableData.columns({
    localization,
    languageData,
    contractSettings,
  });
  const {grantedPolicies} = useGrantedPolicies();
  const table = tableData.table();
  const [updatedData, setUpdatedData] = useState<ContractStoreDetailedDto[]>([]);

  const isFormReady = checkIsFormReady({
    lang,
    languageData,
    grantedPolicies,
    storesLength: contractStores.length,
    contractSettingsLength: contractSettings.length,
  });

  return (
    <FormReadyComponent active={isFormReady.isActive} content={isFormReady.content}>
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
              const mappedData: ContractStoreCreateAndUpdateDto[] = updatedData.map((item) => {
                return {
                  contractSettingId: item.contractSettingId || "",
                  receiptType: item.receiptType,
                  contractTypeIdentifiersSubId: item.contractTypeIdentifiersSubId,
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
                    toast.success(response.message);
                    router.refresh();
                    setUpdatedData([]);
                  } else {
                    toast.error(response.message);
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
    </FormReadyComponent>
  );
}
