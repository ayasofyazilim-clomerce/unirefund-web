"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderDetailForMerchantDto as ContractHeaderDetailForMerchantDto,
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto as RefundTableHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressCommonDataDto } from "@ayasofyazilim/saas/LocationService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { CheckCircle, ListTodo, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentType, Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { handleDeleteResponse } from "src/actions/core/api-utils-client";
import { getMerchantContractHeaderMissingStepsByIdApi } from "src/actions/unirefund/ContractService/action";
import { deleteMerchantContractHeaderByIdApi } from "src/actions/unirefund/ContractService/delete-actions";
import { postMerchantContractHeaderValidateByHeaderIdApi } from "src/actions/unirefund/ContractService/post-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import MerchantContractHeaderForm from "../../../../_components/contract-header-form/merchant";

export function ContractHeader({
  contractHeaderDetails,
  addressList,
  languageData,
  refundTableHeaders,
}: {
  contractHeaderDetails: ContractHeaderDetailForMerchantDto;
  addressList: AddressCommonDataDto[];
  refundTableHeaders: RefundTableHeaderDto[];
  languageData: ContractServiceResource;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="space-y-2">
      <ContractActions
        contractId={contractHeaderDetails.id}
        languageData={languageData}
        loading={loading}
        setLoading={setLoading}
      />
      <MerchantContractHeaderForm
        addresses={addressList}
        contractId={contractHeaderDetails.id}
        formData={{
          ...contractHeaderDetails,
          status: contractHeaderDetails.status || "None",
          addressCommonDataId: contractHeaderDetails.addressCommonData.id,
          refundTableHeaders:
            contractHeaderDetails.contractHeaderRefundTableHeaders.map(
              (item) => {
                return {
                  validFrom: item.validFrom,
                  validTo: item.validTo,
                  isDefault: item.refundTableHeader.isDefault,
                  refundTableHeaderId: item.refundTableHeader.id,
                };
              },
            ),
        }}
        formType="update"
        languageData={languageData}
        loading={loading}
        refundTableHeaders={refundTableHeaders}
        setLoading={setLoading}
      />
    </div>
  );
}

function ContractActions({
  contractId,
  languageData,
  loading,
  setLoading,
}: {
  contractId: string;
  languageData: ContractServiceResource;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  return (
    <div className="flex justify-end gap-2 rounded-md border p-2">
      <ActionButton
        icon={CheckCircle}
        loading={loading}
        onClick={() => {
          setLoading(true);
          void postMerchantContractHeaderValidateByHeaderIdApi(contractId)
            .then((response) => {
              if (response.type === "success" && response.data) {
                toast.success(
                  languageData["Contracts.Actions.Validate.Success"],
                );
              } else {
                toast.error(response.message);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        text={languageData["Contracts.Actions.Validate"]}
      />

      <ActionButton
        icon={ListTodo}
        loading={loading}
        onClick={() => {
          setLoading(true);
          void getMerchantContractHeaderMissingStepsByIdApi(contractId)
            .then((response) => {
              if (response.type === "success" && response.data.length === 0) {
                toast.success(
                  languageData["Contracts.Actions.CheckMissingSteps.Success"],
                );
              } else {
                toast.error(response.message);
              }
              router.refresh();
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        text={languageData["Contracts.Actions.CheckMissingSteps"]}
      />
      <ConfirmDialog
        confirmProps={{
          variant: "destructive",
          children: languageData["Contracts.Actions.Delete"],
          closeAfterConfirm: true,
          onConfirm: () => {
            setLoading(true);
            void deleteMerchantContractHeaderByIdApi(contractId)
              .then((response) => {
                handleDeleteResponse(response, router, "../../");
              })
              .finally(() => {
                setLoading(false);
              });
          },
        }}
        description={languageData["Contracts.Actions.Delete.Description"]}
        title={languageData["Contracts.Actions.Delete.Title"]}
        type="without-trigger"
      >
        <ActionButton
          icon={Trash}
          loading={loading}
          text={languageData["Contracts.Actions.Delete"]}
        />
      </ConfirmDialog>
    </div>
  );
}

function ActionButton({
  loading,
  onClick,
  text,
  icon: Icon,
}: {
  loading: boolean;
  onClick?: () => void;
  text: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Button disabled={loading} onClick={onClick} variant="outline">
      <Icon className="mr-2 size-4" />
      <span className="sr-only">{text}</span>
      <span className="sm:hidden md:block">{text}</span>
    </Button>
  );
}
