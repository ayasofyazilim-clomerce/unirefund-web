"use client";

import {toast} from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderInformationDto as AssignableRefundFeeHeaders,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderDetailForRefundPointDto as ContractHeaderDetailForRefundPointDto,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointUpdateDto as ContractHeaderForRefundPointUpdateDto,
} from "@repo/saas/ContractService";
import {$UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointUpdateDto as $ContractHeaderForRefundPointUpdateDto} from "@repo/saas/ContractService";
import {ActionButton, ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handleDeleteResponse, handlePostResponse, handlePutResponse} from "@repo/utils/api";
import {CheckCircle, CircleX, Trash} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import {
  putRefundPointContractHeadersById,
  putRefundPointContractHeadersByIdMakePassiveApis,
} from "@repo/actions/unirefund/ContractService/put-actions";
import {postRefundPointContractHeaderValidateByHeaderIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {deleteRefundPointContractHeadersById} from "@repo/actions/unirefund/ContractService/delete-actions";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import type {UniRefund_CRMService_Addresses_AddressDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export default function RefundPointContractHeaderUpdateForm({
  addressList,
  languageData,
  refundFeeHeaders,
  contractHeaderDetails,
}: {
  addressList: UniRefund_CRMService_Addresses_AddressDto[];
  languageData: ContractServiceResource;
  refundFeeHeaders: AssignableRefundFeeHeaders[];
  contractHeaderDetails: ContractHeaderDetailForRefundPointDto;
}) {
  const router = useRouter();
  const {partyId, contractId} = useParams<{
    partyId: string;
    contractId: string;
  }>();
  const {grantedPolicies} = useGrantedPolicies();
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    schema: $ContractHeaderForRefundPointUpdateDto,
    name: "Contracts.Form",
    extend: {
      "ui:className": "md:grid md:gap-2 md:grid-cols-2",
      webSite: {
        "ui:className": "md:col-span-full",
      },
      earlyRefund: {
        "ui:widget": "switch",
      },
      addressCommonDataId: {
        "ui:className": "row-start-2",
        "ui:widget": "address",
      },
      status: {
        "ui:className": "md:col-span-full",
      },
      refundFeeHeaders: {
        "ui:className": "md:col-span-full",
        "ui:field": "RefundFeeHeadersField",
        items: {
          refundFeeHeaderId: {
            "ui:widget": "refundFeeHeaders",
          },
          isDefault: {
            "ui:widget": "switch",
          },
        },
      },
    },
  });
  const validFrom = new Date(contractHeaderDetails.validFrom);
  validFrom.setUTCHours(0, 0, 0, 0);
  const validTo = contractHeaderDetails.validTo ? new Date(contractHeaderDetails.validTo) : undefined;
  validTo?.setUTCHours(0, 0, 0, 0);
  const hasEditPermission = isActionGranted(["ContractService.ContractHeaderForRefundPoint.Edit"], grantedPolicies);
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
      <SchemaForm<ContractHeaderForRefundPointUpdateDto>
        disabled={!hasEditPermission || isPending}
        formData={{
          ...contractHeaderDetails,
          validFrom: validFrom.toISOString(),
          validTo: validTo ? validTo.toISOString() : undefined,
          refundFeeHeaders: contractHeaderDetails.refundFeeHeaders.map((x) => ({
            refundFeeHeaderId: x.id,
            ...x,
          })),
        }}
        onSubmit={({formData: editedFormData}) => {
          if (!editedFormData) return;
          startTransition(() => {
            void putRefundPointContractHeadersById({
              id: contractId,
              requestBody: editedFormData,
            }).then((response) => {
              handlePostResponse(response, router, {
                prefix: `/parties/refund-points/${partyId}/contracts`,
                suffix: "contract",
                identifier: "id",
              });
            });
          });
        }}
        schema={$ContractHeaderForRefundPointUpdateDto}
        uiSchema={uiSchema}
        useTableForArrayItems
        widgets={{
          address: CustomComboboxWidget<UniRefund_CRMService_Addresses_AddressDto>({
            list: addressList,
            languageData,
            selectIdentifier: "id",
            selectLabel: "addressLine",
          }),
          refundFeeHeaders: CustomComboboxWidget<AssignableRefundFeeHeaders>({
            list: refundFeeHeaders,
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
  contractDetails: ContractHeaderDetailForRefundPointDto;
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
            void postRefundPointContractHeaderValidateByHeaderIdApi(contractDetails.id).then((response) => {
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
                void putRefundPointContractHeadersByIdMakePassiveApis(contractDetails.id).then((response) => {
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
              void deleteRefundPointContractHeadersById(contractDetails.id).then((response) => {
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
