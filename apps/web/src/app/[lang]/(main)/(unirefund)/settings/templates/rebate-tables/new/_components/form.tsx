"use client";

import {toast} from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderCreateDto as RebateTableHeaderCreateDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as RebateTableHeaderListDto,
} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderCreateDto as $RebateTableHeaderCreateDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto as MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {postRebateTableHeadersApi} from "@/actions/unirefund/ContractService/post-actions";
import {getRebateTableHeadersByIdApi} from "@/actions/unirefund/ContractService/action";
import {ProcessingFeeDetailsField} from "../../_components/processing-fee-details";
import {RebateTableDetailsField} from "../../_components/rebate-table-details-field";

export default function RebateTableHeaderCreateForm({
  languageData,
  merchants,
  defaultFormData,
  rebateTables,
}: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
  defaultFormData?: RebateTableHeaderCreateDto;
  rebateTables: RebateTableHeaderListDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clonedTemplate, setClonedTemplate] = useState<RebateTableHeaderCreateDto | null>();

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
    <div>
      <ActionList className="items-center">
        <span className="ml-auto text-sm">Fill from</span>
        <Combobox<RebateTableHeaderListDto>
          classNames={{container: "w-52"}}
          list={rebateTables}
          onValueChange={(rebateTable: RebateTableHeaderListDto | null | undefined) => {
            if (!rebateTable) return;
            startTransition(() => {
              void getRebateTableHeadersByIdApi(rebateTable.id).then((response) => {
                if (response.type === "success") {
                  setClonedTemplate(response.data);
                } else {
                  toast.error(response.message);
                }
              });
            });
          }}
          selectIdentifier="id"
          selectLabel="name"
        />
      </ActionList>
      <SchemaForm<RebateTableHeaderCreateDto>
        disabled={isPending}
        fields={{
          RebateTableDetailsField: RebateTableDetailsField(
            clonedTemplate?.rebateTableDetails || defaultFormData?.rebateTableDetails || undefined,
          ),
          ProcessingFeeDetailsField: ProcessingFeeDetailsField(
            clonedTemplate?.processingFeeDetails || defaultFormData?.processingFeeDetails || undefined,
          ),
        }}
        formData={clonedTemplate || defaultFormData}
        key={clonedTemplate?.name || defaultFormData?.name}
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
    </div>
  );
}
