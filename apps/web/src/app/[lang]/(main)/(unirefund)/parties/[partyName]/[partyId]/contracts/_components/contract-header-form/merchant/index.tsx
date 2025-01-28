"use client";
import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderInformationDto as AssignableRefundTableHeaders,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantCreateDto as ContractHeaderForMerchantCreateDto,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantUpdateDto as ContractHeaderForMerchantUpdateDto,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaderRefundTableHeaders_ContractHeaderRefundTableHeaderCreateAndUpdateDto as ContractHeaderRefundTableHeaderCreateAndUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantCreateDto as $ContractHeaderForMerchantCreateDto,
  $UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantUpdateDto as $ContractHeaderForMerchantUpdateDto,
  $UniRefund_ContractService_ContractsForMerchant_ContractHeaderRefundTableHeaders_ContractHeaderRefundTableHeaderCreateAndUpdateDto as $ContractHeaderRefundTableHeaderCreateAndUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressTypeDto } from "@ayasofyazilim/saas/LocationService";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
  handlePostResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import { postMerchantContractHeadersByMerchantIdApi } from "src/actions/unirefund/ContractService/action";
import { putMerchantContractHeadersByIdApi } from "src/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import {
  MerchantAddressWidget,
  RefundTableWidget,
} from "../../contract-widgets";

type ContractHeaderFormProps = {
  languageData: ContractServiceResource;
  addresses: AddressTypeDto[];
  refundTableHeaders: AssignableRefundTableHeaders[];
  loading: boolean;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  fromDate?: Date | undefined;
} & (CreateContractHeaderFormProps | UpdateContractHeaderFormProps);

interface CreateContractHeaderFormProps {
  formType: "create";
}
interface UpdateContractHeaderFormProps {
  formType: "update";
  formData: ContractHeaderForMerchantUpdateDto;
  contractId: string;
}

export default function MerchantContractHeaderForm(
  props: ContractHeaderFormProps,
): JSX.Element {
  const {
    languageData,
    addresses,
    refundTableHeaders,
    loading,
    setLoading,
    fromDate,
  } = props;
  const router = useRouter();
  const { partyId, partyName, lang } = useParams<{
    partyId: string;
    partyName: string;
    lang: string;
  }>();
  const [formLoading, setFormLoading] = useState(loading || false);
  function handleLoading(_loading: boolean) {
    if (setLoading) setLoading(_loading);
    setFormLoading(_loading);
  }
  const $Schema = {
    create: $ContractHeaderForMerchantCreateDto,
    update: $ContractHeaderForMerchantUpdateDto,
  };

  const uiSchema = createUiSchemaWithResource({
    name: "Contracts.Form",
    resources: languageData,
    schema: $Schema[props.formType],
    extend: {
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
        "ui:field": "RefundTableHeaders",
      },
      validFrom: {
        "ui:options": {
          fromDate,
          //eğer aktif contract varsa onun validTosundan önce olamaz
          //eğer aktif contract yoksa bugünden önce olamaz
        },
      },
    },
  });
  return (
    <SchemaForm
      className="grid gap-2"
      disabled={formLoading || loading}
      fields={{
        RefundTableHeaders: RefundTableField(
          props.formType === "update"
            ? props.formData.refundTableHeaders
            : undefined,
          languageData,
          refundTableHeaders,
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
          "refundTableHeaders",
          "refundTableHeaders.isDefault",
          "refundTableHeaders.validFrom",
          "refundTableHeaders.validTo",
          "refundTableHeaders.refundTableHeaderId",
        ],
      }}
      formData={props.formType === "update" ? props.formData : undefined}
      onSubmit={(data) => {
        if (!data.formData) return;
        handleLoading(true);
        if (props.formType === "create") {
          void postMerchantContractHeadersByMerchantIdApi({
            id: partyId,
            requestBody: data.formData as ContractHeaderForMerchantCreateDto,
          })
            .then((response) => {
              handlePostResponse(response, router, {
                prefix: `/parties/${partyName}/${partyId}/contracts`,
                suffix: "contract",
                identifier: "id",
              });
            })
            .finally(() => {
              handleLoading(false);
            });
        } else {
          void putMerchantContractHeadersByIdApi({
            id: props.contractId,
            requestBody: data.formData,
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
      submitText={languageData["Contracts.Create.Submit"]}
      uiSchema={uiSchema}
      widgets={{
        address: MerchantAddressWidget({
          loading,
          addressList: addresses,
          languageData,
        }),
        refundTable: RefundTableWidget({
          loading,
          refundTableHeaders,
          languageData,
        }),
      }}
      withScrollArea
    />
  );
}

function RefundTableField(
  formData:
    | ContractHeaderRefundTableHeaderCreateAndUpdateDto[]
    | undefined
    | null,
  languageData: ContractServiceResource,
  refundTableHeaders: AssignableRefundTableHeaders[],
) {
  return TableField<ContractHeaderRefundTableHeaderCreateAndUpdateDto>({
    editable: true,
    fillerColumn: "refundTableHeaderId",
    data: formData || [],
    columns:
      tanstackTableEditableColumnsByRowData<ContractHeaderRefundTableHeaderCreateAndUpdateDto>(
        {
          rows: {
            ...$ContractHeaderRefundTableHeaderCreateAndUpdateDto.properties,
            refundTableHeaderId: {
              ...$ContractHeaderRefundTableHeaderCreateAndUpdateDto.properties
                .refundTableHeaderId,
              enum: refundTableHeaders.map((x) => ({
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
