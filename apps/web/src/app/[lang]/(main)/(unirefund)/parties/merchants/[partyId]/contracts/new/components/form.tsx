"use client";
import {postMerchantContractHeadersByMerchantIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderInformationDto as AssignableRefundTableHeaders,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantCreateDto as ContractHeaderForMerchantCreateDto,
} from "@repo/saas/ContractService";
import {$UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantCreateDto as $ContractHeaderForMerchantCreateDto} from "@repo/saas/ContractService";
import type {UniRefund_CRMService_Addresses_AddressDto} from "@repo/saas/CRMService";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export default function MerchantContractHeaderCreateForm({
  addressList,
  languageData,
  refundTableHeaders,
}: {
  addressList: UniRefund_CRMService_Addresses_AddressDto[];
  languageData: ContractServiceResource;
  refundTableHeaders: AssignableRefundTableHeaders[];
}) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
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

  return (
    <SchemaForm<ContractHeaderForMerchantCreateDto>
      disabled={isPending}
      formData={{
        validFrom: today.toISOString(),
        refundTableHeaders: [
          {
            refundTableHeaderId: refundTableHeaders[0]?.id || "",
            validFrom: today.toISOString(),
            isDefault: true,
          },
        ],
        merchantClassification: "Satisfactory",
        addressCommonDataId: addressList[0].id || "",
      }}
      onSubmit={({formData: editedFormData}) => {
        if (!editedFormData) return;
        startTransition(() => {
          void postMerchantContractHeadersByMerchantIdApi({
            id: partyId,
            requestBody: editedFormData,
          }).then((response) => {
            handlePostResponse(response, router, {
              prefix: `/parties/merchants/${partyId}/contracts`,
              suffix: "contract",
              identifier: "id",
            });
          });
        });
      }}
      schema={$ContractHeaderForMerchantCreateDto}
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
  );
}
