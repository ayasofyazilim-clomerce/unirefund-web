"use client";

import {toast} from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderCreateDto as RebateTableHeaderCreateDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as RebateTableHeaderListDto,
} from "@repo/saas/ContractService";
import {$UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderCreateDto as $RebateTableHeaderCreateDto} from "@repo/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantListResponseDto as MerchantProfileDto} from "@repo/saas/CRMService";
import {getRebateTableHeadersByIdApi} from "@repo/actions/unirefund/ContractService/action";
import {postRebateTableHeadersApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export default function RebateTableHeaderCreateForm({
  languageData,
  merchants,
  rebateTables,
}: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
  rebateTables: RebateTableHeaderListDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRebateTable, setSelectedRebateTable] = useState<string>("");
  const [formData, setFormData] = useState<RebateTableHeaderCreateDto>({
    name: "",
    isTemplate: true,
    rebateTableDetails: [{fixedFeeValue: 0, percentFeeValue: 0, refundMethod: "All", variableFee: "PercentOfGC"}],
    processingFeeDetails: [{amount: 0, name: ""}],
  });
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    schema: $RebateTableHeaderCreateDto,
    name: "Contracts.Form",
    extend: {
      calculateNetCommissionInsteadOfRefund: {
        "ui:widget": "switch",
        "ui:className": " border px-2 rounded-md",
      },
      isTemplate: {
        "ui:widget": "switch",
        "ui:className": " border px-2 rounded-md",
      },
      rebateTableDetails: {
        "ui:field": "RebateTableDetailsField",
        "ui:options": {
          copyable: true,
        },
      },
      processingFeeDetails: {
        "ui:field": "ProcessingFeeDetailsField",
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
    },
  });

  return (
    <div className="flex w-full flex-col gap-2 overflow-hidden">
      <ActionList className="mx-auto w-full max-w-4xl border-none p-0">
        <Combobox<RebateTableHeaderListDto>
          classNames={{container: "w-full "}}
          emptyValue={languageData["Select.EmptyValue"]}
          label={languageData["Contracts.FillFrom"]}
          list={rebateTables}
          onValueChange={(rebateTable: RebateTableHeaderListDto | null | undefined) => {
            if (!rebateTable) return;
            startTransition(() => {
              void getRebateTableHeadersByIdApi(rebateTable.id).then((response) => {
                if (response.type === "success") {
                  setFormData(response.data);
                  setSelectedRebateTable(rebateTable.id);
                } else {
                  toast.error(response.message);
                }
              });
            });
          }}
          searchPlaceholder={languageData["Select.Placeholder"]}
          searchResultLabel={languageData["Select.ResultLabel"]}
          selectIdentifier="id"
          selectLabel="name"
        />
      </ActionList>
      <SchemaForm<RebateTableHeaderCreateDto>
        className="mx-auto w-full max-w-4xl pr-0"
        disabled={isPending}
        formData={formData}
        key={selectedRebateTable}
        onChange={({formData: editedFormData}) => {
          if (!editedFormData) return;
          setFormData(editedFormData);
        }}
        onSubmit={({formData: editedFormData}) => {
          if (!editedFormData) return;
          startTransition(() => {
            void postRebateTableHeadersApi({requestBody: editedFormData}).then((response) => {
              handlePostResponse(response, router, {
                prefix: getBaseLink("/settings/templates/rebate-tables"),
                identifier: "id",
              });
            });
          });
        }}
        schema={$RebateTableHeaderCreateDto}
        submitText={languageData.Save}
        uiSchema={uiSchema}
        useDependency
        useTableForArrayItems
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
