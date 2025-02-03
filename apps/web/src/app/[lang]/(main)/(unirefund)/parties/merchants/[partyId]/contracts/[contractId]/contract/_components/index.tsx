"use client";

import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderInformationDto as AssignableRefundTableHeaders,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderDetailForMerchantDto as ContractHeaderDetailForMerchantDto,
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
import { deleteMerchantContractHeaderByIdApi } from "src/actions/unirefund/ContractService/delete-actions";
import { postMerchantContractHeaderValidateByHeaderIdApi } from "src/actions/unirefund/ContractService/post-actions";
import { putMerchantsContractHeadersByIdMakePassiveApi } from "src/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import MerchantContractHeaderForm from "../../../_components/contact-header-form";

export function ContractHeader({
  contractHeaderDetails,
  addressList,
  languageData,
  refundTableHeaders,
  fromDate,
}: {
  contractHeaderDetails: ContractHeaderDetailForMerchantDto;
  addressList: AddressCommonDataDto[];
  refundTableHeaders: AssignableRefundTableHeaders[];
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
      <MerchantContractHeaderForm
        addresses={addressList}
        contractId={contractHeaderDetails.id}
        formData={{
          ...contractHeaderDetails,
          status: contractHeaderDetails.status,
          refundTableHeaders: [
            ...contractHeaderDetails.refundTableHeaders.map(
              (refundTableHeader) => {
                return {
                  ...refundTableHeader,
                  refundTableHeaderId: refundTableHeader.id,
                  validTo:
                    refundTableHeader.validTo || new Date().toISOString(),
                };
              },
            ),
          ],
        }}
        formType="update"
        fromDate={fromDate}
        languageData={languageData}
        loading={loading}
        refundTableHeaders={refundTableHeaders}
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
  contractDetails: ContractHeaderDetailForMerchantDto;
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
          void postMerchantContractHeaderValidateByHeaderIdApi(
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
              void putMerchantsContractHeadersByIdMakePassiveApi(
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
            void deleteMerchantContractHeaderByIdApi(contractDetails.id)
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
