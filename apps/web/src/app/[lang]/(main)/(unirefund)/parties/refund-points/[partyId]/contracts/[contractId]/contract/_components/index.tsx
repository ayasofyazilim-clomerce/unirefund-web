"use client";

import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderInformationDto as AssignableRefundFeeHeaders,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderDetailForRefundPointDto as ContractHeaderDetailForRefundPointDto,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressCommonDataDto } from "@ayasofyazilim/saas/LocationService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { ActionButton, ActionList } from "@repo/ui/action-button";
import { CheckCircle, CircleX, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
  handleDeleteResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import { deleteRefundPointContractHeadersById } from "src/actions/unirefund/ContractService/delete-actions";
import { postRefundPointContractHeaderValidateByHeaderId } from "src/actions/unirefund/ContractService/post-actions";
import { putRefundPointContractHeadersByIdMakePassiveApis } from "src/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import RefundPointContractHeaderForm from "../../../_components/contract-header-form";

export function ContractHeader({
  contractHeaderDetails,
  addressList,
  languageData,
  refundFeeHeaders,
  fromDate,
}: {
  contractHeaderDetails: ContractHeaderDetailForRefundPointDto;
  addressList: AddressCommonDataDto[];
  refundFeeHeaders: AssignableRefundFeeHeaders[];
  languageData: ContractServiceResource;
  fromDate: Date | undefined;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="space-y-2">
      <ContractActions
        contractDetails={contractHeaderDetails}
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
          refundFeeHeaders: [
            ...contractHeaderDetails.refundFeeHeaders.map((refundFeeHeader) => {
              return {
                ...refundFeeHeader,
                refundFeeHeaderId: refundFeeHeader.id,
                validTo: refundFeeHeader.validTo || new Date().toISOString(),
              };
            }),
          ],
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
  contractDetails,
  languageData,
  loading,
  setLoading,
}: {
  contractDetails: ContractHeaderDetailForRefundPointDto;
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
          void postRefundPointContractHeaderValidateByHeaderId(
            contractDetails.id,
          )
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
      {!contractDetails.isDraft && !contractDetails.isActive && (
        <ConfirmDialog
          confirmProps={{
            variant: "destructive",
            children: languageData["Contracts.Actions.MakePassive"],
            closeAfterConfirm: true,
            onConfirm: () => {
              setLoading(true);
              void putRefundPointContractHeadersByIdMakePassiveApis(
                contractDetails.id,
              )
                .then((response) => {
                  handlePutResponse(response, router, "../../");
                })
                .finally(() => {
                  setLoading(false);
                });
            },
          }}
          description={
            languageData["Contracts.Actions.MakePassive.Description"]
          }
          title={languageData["Contracts.Actions.MakePassive.Title"]}
          type="without-trigger"
        >
          <ActionButton
            icon={CircleX}
            loading={loading}
            text={languageData["Contracts.Actions.MakePassive"]}
          />
        </ConfirmDialog>
      )}
      <ConfirmDialog
        confirmProps={{
          variant: "destructive",
          children: languageData["Contracts.Actions.Delete"],
          closeAfterConfirm: true,
          onConfirm: () => {
            setLoading(true);
            void deleteRefundPointContractHeadersById(contractDetails.id)
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
