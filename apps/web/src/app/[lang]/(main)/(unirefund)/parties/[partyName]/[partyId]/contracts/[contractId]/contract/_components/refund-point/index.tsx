"use client";

import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderDetailForRefundPointDto as ContractHeaderDetailForRefundPointDto,
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto as RefundFeeHeader,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressCommonDataDto } from "@ayasofyazilim/saas/LocationService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { ActionButton, ActionList } from "@repo/ui/action-button";
import { CheckCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { handleDeleteResponse } from "src/actions/core/api-utils-client";
import { deleteRefundPointContractHeadersById } from "src/actions/unirefund/ContractService/delete-actions";
import { postRefundPointContractHeaderValidateByHeaderId } from "src/actions/unirefund/ContractService/post-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import RefundPointContractHeaderForm from "../../../../_components/contract-header-form/refund-point";

export function ContractHeader({
  contractHeaderDetails,
  addressList,
  languageData,
  refundFeeHeaders,
  fromDate,
}: {
  contractHeaderDetails: ContractHeaderDetailForRefundPointDto;
  addressList: AddressCommonDataDto[];
  refundFeeHeaders: RefundFeeHeader[];
  languageData: ContractServiceResource;
  fromDate: Date | undefined;
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
      <RefundPointContractHeaderForm
        addresses={addressList}
        contractId={contractHeaderDetails.id}
        formData={{
          ...contractHeaderDetails,
          status: contractHeaderDetails.status || "None",
          addressCommonDataId: contractHeaderDetails.addressCommonData.id,
          refundFeeHeaders:
            contractHeaderDetails.contractHeaderRefundFeeHeaders.map((item) => {
              return {
                validFrom: item.validFrom,
                validTo: item.validTo,
                refundFeeHeaderId: item.refundFeeHeader.id,
                isDefault: item.isDefault,
              };
            }),
        }}
        formType="update"
        fromDate={fromDate}
        languageData={languageData}
        loading={loading}
        refundFeeHeaders={refundFeeHeaders}
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
    <ActionList>
      <ActionButton
        icon={CheckCircle}
        loading={loading}
        onClick={() => {
          setLoading(true);
          void postRefundPointContractHeaderValidateByHeaderId(contractId)
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

      {/* <ActionButton
        icon={ListTodo}
        loading={loading}
        onClick={() => {
          setLoading(true);
          void getRefundPointContractHeaderIsValidatableByIdApi(contractId)
            .then((response) => {
              if (response.type === "success") {
                toast.success(
                  languageData["Contracts.Actions.IsValidatable.Success"],
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
        text={languageData["Contracts.Actions.IsValidatable"]}
      /> */}
      <ConfirmDialog
        confirmProps={{
          variant: "destructive",
          children: languageData["Contracts.Actions.Delete"],
          closeAfterConfirm: true,
          onConfirm: () => {
            setLoading(true);
            void deleteRefundPointContractHeadersById(contractId)
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
    </ActionList>
  );
}
