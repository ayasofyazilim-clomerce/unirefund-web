"use client";
import type {
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderInformationDto as AssignableRefundFeeHeaders,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointCreateDto as ContractHeaderForRefundPointCreateDto,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointUpdateDto as ContractHeaderForRefundPointUpdateDto,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaderRefundFeeHeaders_ContractHeaderRefundFeeHeaderCreateAndUpdateDto as ContractHeaderRefundFeeHeaderCreateAndUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointCreateDto as $ContractHeaderForRefundPointCreateDto,
  $UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointUpdateDto as $ContractHeaderForRefundPointUpdateDto,
  $UniRefund_ContractService_ContractsForRefundPoint_ContractHeaderRefundFeeHeaders_ContractHeaderRefundFeeHeaderCreateAndUpdateDto as $ContractHeaderRefundFeeHeaderCreateAndUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressTypeDto } from "@ayasofyazilim/saas/LocationService";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { handlePostResponse, handlePutResponse } from "@repo/utils/api";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { postRefundPointContractHeadersById } from "src/actions/unirefund/ContractService/post-actions";
import { putRefundPointContractHeadersById } from "src/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { MerchantAddressWidget } from "./contract-widgets";

type RefundPointContractHeaderFormProps = {
  loading: boolean;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  languageData: ContractServiceResource;
  addresses: AddressTypeDto[];
  refundFeeHeaders: AssignableRefundFeeHeaders[];
  fromDate: Date | undefined;
} & (
  | RefundPointContractHeaderUpdateFormProps
  | RefundPointContractHeaderCreateFormProps
);
interface RefundPointContractHeaderUpdateFormProps {
  formType: "update";
  contractId: string;
  formData: ContractHeaderForRefundPointUpdateDto;
}
interface RefundPointContractHeaderCreateFormProps {
  formType: "create";
  formData: ContractHeaderForRefundPointCreateDto;
}

export default function RefundPointContractHeaderForm(
  props: RefundPointContractHeaderFormProps,
) {
  const {
    formData,
    loading,
    languageData,
    addresses,
    refundFeeHeaders,
    setLoading,
    fromDate,
  } = props;
  const router = useRouter();
  const { partyId } = useParams<{
    partyId: string;
  }>();
  const [formLoading, setFormLoading] = useState(loading || false);
  function handleLoading(_loading: boolean) {
    if (setLoading) setLoading(_loading);
    setFormLoading(_loading);
  }
  const $Schema = {
    create: $ContractHeaderForRefundPointCreateDto,
    update: $ContractHeaderForRefundPointUpdateDto,
  };
  const uiSchema = createUiSchemaWithResource({
    name: "Contracts.Form",
    resources: languageData,
    schema: $Schema[props.formType],
    extend: {
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
      earlyRefund: {
        "ui:widget": "switch",
      },
      validFrom: {
        "ui:options": {
          fromDate,
          //eğer aktif contract varsa onun validTosundan önce olamaz
          //eğer aktif contract yoksa bugünden önce olamaz
        },
      },
      refundFeeHeaders: {
        "ui:className": "md:col-span-full",
        "ui:field": "RefundFeeHeaders",
      },
    },
  });
  return (
    <SchemaForm
      disabled={formLoading || loading}
      fields={{
        RefundFeeHeaders: RefundFeeField(
          props.formType === "update"
            ? props.formData.refundFeeHeaders
            : undefined,
          languageData,
          refundFeeHeaders,
        ),
      }}
      filter={{
        type: "include",
        sort: true,
        keys: [
          "validFrom",
          "validTo",
          "merchantClassification",
          "addressCommonDataId",
          "webSite",
          "status",
          "refundFeeHeaders",
          "refundFeeHeaders.validFrom",
          "refundFeeHeaders.validTo",
          "refundFeeHeaders.refundFeeHeaderId",
        ],
      }}
      formData={formData}
      onSubmit={({ formData: submitData }) => {
        if (!submitData) return;
        handleLoading(true);
        if (props.formType === "create") {
          void postRefundPointContractHeadersById({
            id: partyId,
            requestBody: submitData as ContractHeaderForRefundPointCreateDto,
          })
            .then((response) => {
              handlePostResponse(response, router, {
                prefix: `/parties/refund-points/${partyId}/contracts`,
                suffix: "contract",
                identifier: "id",
              });
            })
            .finally(() => {
              handleLoading(false);
            });
        } else {
          void putRefundPointContractHeadersById({
            id: props.contractId,
            requestBody: submitData as ContractHeaderForRefundPointUpdateDto,
          })
            .then((response) => {
              handlePutResponse(response, router);
            })
            .finally(() => {
              handleLoading(false);
            });
        }
      }}
      schema={$Schema[props.formType]}
      uiSchema={uiSchema}
      widgets={{
        address: MerchantAddressWidget({
          loading: formLoading || loading,
          addressList: addresses,
          languageData,
        }),
      }}
    />
  );
}

function RefundFeeField(
  formData:
    | ContractHeaderRefundFeeHeaderCreateAndUpdateDto[]
    | undefined
    | null,
  languageData: ContractServiceResource,
  refundFeeHeaders: AssignableRefundFeeHeaders[],
) {
  return TableField<ContractHeaderRefundFeeHeaderCreateAndUpdateDto>({
    editable: true,
    fillerColumn: "refundFeeHeaderId",
    data: formData || [],
    columns:
      tanstackTableEditableColumnsByRowData<ContractHeaderRefundFeeHeaderCreateAndUpdateDto>(
        {
          rows: {
            ...$ContractHeaderRefundFeeHeaderCreateAndUpdateDto.properties,
            refundFeeHeaderId: {
              ...$ContractHeaderRefundFeeHeaderCreateAndUpdateDto.properties
                .refundFeeHeaderId,
              enum: refundFeeHeaders.map((x) => ({
                value: x.id,
                label: x.name,
              })),
            },
          },
          excludeColumns: ["extraProperties"],
        },
      ),
    tableActions: [
      {
        type: "create-row",
        actionLocation: "table",
        cta: languageData["Rebate.Form.rebateTableDetails.add"],
        icon: PlusCircle,
      },
    ],
    rowActions: [
      {
        actionLocation: "row",
        cta: languageData["Rebate.Form.rebateTableDetails.delete"],
        type: "delete-row",
      },
    ],
  });
}
