"use client";

import {useTransition} from "react";
import {useRouter} from "next/navigation";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderCreateDto as RebateTableHeaderCreateDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderCreateDto as $RebateTableHeaderCreateDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto as MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import {handlePostResponse} from "@repo/utils/api";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {postRebateTableHeadersApi} from "@/actions/unirefund/ContractService/post-actions";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {RebateTableDetailsField} from "../../_components/rebate-table-details-field";
import {ProcessingFeeDetailsField} from "../../_components/processing-fee-details";

export default function RebateTableHeaderCreateForm({
  languageData,
  merchants,
}: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const uiSchema = {
    "ui:className": "grid md:grid-cols-2",
    calculateNetCommissionInsteadOfRefund: {
      "ui:widget": "switch",
      "ui:className": "border px-2 rounded-md h-max self-end",
    },
    isTemplate: {
      "ui:widget": "switch",
      "ui:className": "border px-2 rounded-md h-max self-end",
    },
    rebateTableDetails: {
      "ui:field": "RebateTableDetailsField",
      "ui:className": "md:col-span-full",
    },
    processingFeeDetails: {
      "ui:field": "ProcessingFeeDetailsField",
      "ui:className": "md:col-span-full",
    },
    merchantId: {
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
  };
  return (
    <SchemaForm<RebateTableHeaderCreateDto>
      disabled={isPending}
      fields={{
        RebateTableDetailsField: RebateTableDetailsField(),
        ProcessingFeeDetailsField: ProcessingFeeDetailsField(),
      }}
      formData={{
        name: "",
        calculateNetCommissionInsteadOfRefund: false,
        isTemplate: true,
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postRebateTableHeadersApi({requestBody: formData}).then((response) => {
            handlePostResponse(response, router, {
              identifier: "id",
              prefix: "./",
            });
          });
        });
      }}
      schema={$RebateTableHeaderCreateDto}
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
