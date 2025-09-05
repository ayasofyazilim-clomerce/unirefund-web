"use client";
import type {
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderInformationDto as AssignableRefundFeeHeaders,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointCreateDto as ContractHeaderForRefundPointCreateDto,
} from "@repo/saas/ContractService";
import {$UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointCreateDto as $ContractHeaderForRefundPointCreateDto} from "@repo/saas/ContractService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {postRefundPointContractHeadersByIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import type {UniRefund_CRMService_Addresses_AddressDto} from "@repo/saas/CRMService";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export default function RefundPointContractHeaderCreateForm({
  addressList,
  languageData,
  refundFeeHeaders,
}: {
  addressList: UniRefund_CRMService_Addresses_AddressDto[];
  languageData: ContractServiceResource;
  refundFeeHeaders: AssignableRefundFeeHeaders[];
}) {
  const router = useRouter();
  const {partyId} = useParams<{
    partyId: string;
  }>();
  const [isPending, startTransition] = useTransition();
  const uiSchema = {
    "ui:className": "md:grid md:gap-2 md:grid-cols-2",
    webSite: {
      "ui:className": "md:col-span-full",
      "ui:options": {
        inputType: "url",
      },
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
      items: {
        isDefault: {
          "ui:widget": "switch",
        },
        refundFeeHeaderId: {
          "ui:widget": "refundFeeHeaders",
        },
      },
    },
  };
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return (
    <SchemaForm<ContractHeaderForRefundPointCreateDto>
      disabled={isPending}
      formData={{
        validFrom: today.toISOString(),
        refundFeeHeaders: [
          {
            refundFeeHeaderId: refundFeeHeaders[0]?.id || "",
            validFrom: today.toISOString(),
          },
        ],
        merchantClassification: "Satisfactory",
        addressCommonDataId: addressList[0].id || "",
      }}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void postRefundPointContractHeadersByIdApi({
            id: partyId,
            requestBody: formData,
          }).then((response) => {
            handlePostResponse(response, router, {
              prefix: `/parties/refund-points/${partyId}/contracts`,
              suffix: "contract",
              identifier: "id",
            });
          });
        });
      }}
      schema={$ContractHeaderForRefundPointCreateDto}
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
  );
}
