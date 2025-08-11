"use client";

import {toast} from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderInformationDto as AssignableRefundTableHeaders,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderDetailForMerchantDto as ContractHeaderDetailForMerchantDto,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantUpdateDto as ContractHeaderForMerchantUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantUpdateDto as $ContractHeaderForMerchantUpdateDto} from "@ayasofyazilim/saas/ContractService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {ActionButton, ActionList} from "@repo/ui/action-button";
import {CheckCircle, CircleX, Trash} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import {handleDeleteResponse, handlePutResponse} from "@repo/utils/api";
import {deleteMerchantContractHeaderByIdApi} from "@repo/actions/unirefund/ContractService/delete-actions";
import {postMerchantContractHeaderValidateByHeaderIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {
  putMerchantContractHeadersByIdApi,
  putMerchantsContractHeadersByIdMakePassiveApi,
} from "@repo/actions/unirefund/ContractService/put-actions";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import type {UniRefund_CRMService_Addresses_AddressDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";

export function MerchantContractHeaderUpdateForm({
  contractHeaderDetails,
  addressList,
  languageData,
  refundTableHeaders,
}: {
  contractHeaderDetails: ContractHeaderDetailForMerchantDto;
  addressList: UniRefund_CRMService_Addresses_AddressDto[];
  refundTableHeaders: AssignableRefundTableHeaders[];
  languageData: ContractServiceResource;
}) {
  const router = useRouter();
  const {lang, contractId} = useParams<{
    lang: string;
    contractId: string;
  }>();
  const {grantedPolicies} = useGrantedPolicies();
  const [isPending, startTransition] = useTransition();
  const uiSchema = {
    "ui:config": {
      locale: lang,
    },
    "ui:options": {
      expandable: false,
    },
    webSite: {
      "ui:className": "md:col-span-full",
      "ui:options": {
        inputType: "url",
      },
    },
    "ui:className": "md:grid md:gap-2 md:grid-cols-2",
    addressCommonDataId: {
      "ui:className": "row-start-2",
      "ui:widget": "address",
    },
    status: {
      "ui:className": "md:col-span-full",
    },
    refundTableHeaders: {
      "ui:className": "md:col-span-full",
      items: {
        isDefault: {
          "ui:widget": "switch",
        },
        refundTableHeaderId: {
          "ui:widget": "refundTableHeader",
        },
      },
    },
  };
  const validFrom = new Date(contractHeaderDetails.validFrom);
  validFrom.setUTCHours(0, 0, 0, 0);
  const validTo = contractHeaderDetails.validTo ? new Date(contractHeaderDetails.validTo) : undefined;
  validTo?.setUTCHours(0, 0, 0, 0);
  const hasEditPermission = isActionGranted(["ContractService.ContractHeaderForMerchant.Edit"], grantedPolicies);
  return (
    <div className="space-y-2">
      {hasEditPermission ? (
        <ContractActions
          contractDetails={contractHeaderDetails}
          isPending={isPending}
          languageData={languageData}
          startTransition={startTransition}
        />
      ) : null}
      <SchemaForm<ContractHeaderForMerchantUpdateDto>
        disabled={!hasEditPermission || isPending}
        formData={{
          ...contractHeaderDetails,
          validFrom: validFrom.toISOString(),
          validTo: validTo ? validTo.toISOString() : undefined,
          refundTableHeaders: contractHeaderDetails.refundTableHeaders.map((x) => ({
            ...x,
            refundTableHeaderId: x.id,
          })),
        }}
        onSubmit={({formData: editedFormData}) => {
          if (!editedFormData) return;
          startTransition(() => {
            void putMerchantContractHeadersByIdApi({
              id: contractId,
              requestBody: editedFormData,
            }).then((response) => {
              handlePutResponse(response, router);
            });
          });
        }}
        schema={$ContractHeaderForMerchantUpdateDto}
        uiSchema={uiSchema}
        useTableForArrayItems
        widgets={{
          address: CustomComboboxWidget<UniRefund_CRMService_Addresses_AddressDto>({
            list: addressList,
            languageData,
            selectIdentifier: "id",
            selectLabel: "addressLine",
          }),
          refundTableHeader: CustomComboboxWidget<AssignableRefundTableHeaders>({
            list: refundTableHeaders,
            languageData,
            selectIdentifier: "id",
            selectLabel: "name",
          }),
        }}
      />
    </div>
  );
}

function ContractActions({
  contractDetails,
  languageData,
  isPending,
  startTransition,
}: {
  contractDetails: ContractHeaderDetailForMerchantDto;
  languageData: ContractServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) {
  const router = useRouter();
  return (
    <ActionList>
      <ActionButton
        icon={CheckCircle}
        loading={isPending}
        onClick={() => {
          startTransition(() => {
            void postMerchantContractHeaderValidateByHeaderIdApi(contractDetails.id).then((response) => {
              if (response.type === "success" && response.data) {
                toast.success(response.message);
              } else {
                toast.error(response.message);
              }
            });
          });
        }}
        text={languageData["Contracts.Validate"]}
      />
      {!contractDetails.isDraft && !contractDetails.isActive && (
        <ConfirmDialog
          confirmProps={{
            variant: "destructive",
            children: languageData["Contracts.Deactivate"],
            closeAfterConfirm: true,
            onConfirm: () => {
              startTransition(() => {
                void putMerchantsContractHeadersByIdMakePassiveApi(contractDetails.id).then((response) => {
                  handlePutResponse(response, router, "../");
                });
              });
            },
          }}
          description={languageData["Contracts.Deactivate.Description"]}
          title={languageData["Contracts.Deactivate.Title"]}
          type="without-trigger">
          <ActionButton icon={CircleX} loading={isPending} text={languageData["Contracts.Deactivate"]} />
        </ConfirmDialog>
      )}
      <ConfirmDialog
        confirmProps={{
          variant: "destructive",
          children: languageData.Delete,
          closeAfterConfirm: true,
          onConfirm: () => {
            startTransition(() => {
              void deleteMerchantContractHeaderByIdApi(contractDetails.id).then((response) => {
                handleDeleteResponse(response, router, "../");
              });
            });
          },
        }}
        description={languageData["Delete.Assurance"]}
        title={languageData.Delete}
        type="without-trigger">
        <ActionButton icon={Trash} loading={isPending} text={languageData.Delete} />
      </ConfirmDialog>
    </ActionList>
  );
}
