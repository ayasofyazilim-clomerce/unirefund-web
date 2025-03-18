"use client";
import type {
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderInformationDto as AssignableRefundFeeHeaders,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointCreateDto as ContractHeaderForRefundPointCreateDto,
} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointCreateDto as $ContractHeaderForRefundPointCreateDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressTypeDto} from "@ayasofyazilim/saas/LocationService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {postRefundPointContractHeadersByIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {RefundFeeHeadersField} from "../../_components/refund-fee-headers-field";

export default function RefundPointContractHeaderCreateForm({
  addressList,
  languageData,
  refundFeeHeaders,
}: {
  addressList: AddressTypeDto[];
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
    earlyRefund: {
      "ui:widget": "switch",
    },
    refundFeeHeaders: {
      "ui:className": "md:col-span-full",
      "ui:field": "RefundFeeHeadersField",
    },
  };
  return (
    <SchemaForm<ContractHeaderForRefundPointCreateDto>
      disabled={isPending}
      fields={{
        RefundFeeHeadersField: RefundFeeHeadersField({
          refundFeeHeaders,
          data: [
            {
              validFrom: new Date().toISOString(),
              refundFeeHeaderId: refundFeeHeaders[0]?.id || "",
              isDefault: true,
            },
          ],
          languageData,
        }),
      }}
      formData={{
        validFrom: new Date().toISOString(),
        refundFeeHeaders: [
          {
            refundFeeHeaderId: refundFeeHeaders[0]?.id || "",
            validFrom: new Date().toISOString(),
          },
        ],
        merchantClassification: "Satisfactory",
        addressCommonDataId: addressList[0].id,
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
      widgets={{
        address: CustomComboboxWidget<AddressTypeDto>({
          list: addressList,
          languageData,
          selectIdentifier: "id",
          selectLabel: "fullAddress",
        }),
      }}
    />
  );
}
