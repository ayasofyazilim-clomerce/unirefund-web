"use client";
import type {UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderCreateDto as RefundTableHeaderCreateDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderCreateDto as $RefundTableHeaderCreateDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto as MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {postRefundTableHeadersApi} from "@repo/actions/unirefund/ContractService/post-actions";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {getBaseLink} from "@/utils";
import {RefundTableDetailsField} from "../../_components/refund-table-details-field";

export default function RefundTableHeaderCreateForm({
  languageData,
  merchants,
}: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<RefundTableHeaderCreateDto>({
    name: "",
    isDefault: false,
    isBundling: false,
    isTemplate: true,
    refundTableDetails: [{vatRate: 0, minValue: 0, maxValue: 0, refundPercent: 0, refundAmount: 0, isLoyalty: false}],
  });
  const uiSchema = createUiSchemaWithResource({
    schema: $RefundTableHeaderCreateDto,
    resources: languageData,
    name: "Contracts.Form",
    extend: {
      "ui:className": "flex flex-col items-center justify-center border  rounded-md md:p-6 p-2 my-6 gap-0",
      name: {"ui:className": "max-w-xl"},
      isTemplate: {
        "ui:widget": "switch",
        "ui:className": "max-w-xl",
      },
      isDefault: {
        "ui:widget": "switch",
        "ui:className": "max-w-xl",
      },
      isBundling: {
        "ui:widget": "switch",
        "ui:className": "max-w-xl",
      },
      merchantId: {
        "ui:className": "col-span-full",
        "ui:widget": "MerchantsWidget",
        dependencies: [
          {
            target: "isTemplate",
            when: (targetValue: boolean) => targetValue,
            type: DependencyType.HIDES,
          },
          {
            target: "isTemplate",
            when: (targetValue: boolean) => !targetValue,
            type: DependencyType.REQUIRES,
          },
        ],
      },
      refundTableDetails: {
        "ui:field": "RefundTableDetailsField",
        "ui:className": "border-none p-0 w-full",
      },
    },
  });
  return (
    <SchemaForm<RefundTableHeaderCreateDto>
      className="flex flex-col  justify-center pr-0"
      disabled={isPending}
      fields={{
        RefundTableDetailsField: RefundTableDetailsField({
          data: formData.refundTableDetails !== null ? formData.refundTableDetails : [],
          languageData,
        }),
      }}
      formData={formData}
      onChange={({formData: editedFormData}) => {
        if (!editedFormData) return;
        setFormData(editedFormData);
      }}
      onSubmit={({formData: editedFormData}) => {
        if (!editedFormData) return;
        startTransition(() => {
          void postRefundTableHeadersApi({requestBody: editedFormData}).then((response) => {
            handlePostResponse(response, router, {
              prefix: getBaseLink("/settings/templates/refund-tables"),
              identifier: "id",
            });
          });
        });
      }}
      schema={$RefundTableHeaderCreateDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      useDependency
      widgets={{
        MerchantsWidget: CustomComboboxWidget<MerchantProfileDto>({
          languageData,
          list: merchants,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
    />
  );
}
