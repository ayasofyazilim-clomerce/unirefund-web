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
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {postRebateTableHeadersApi} from "@/actions/unirefund/ContractService/post-actions";
import {getRebateTableHeadersByIdApi} from "@/actions/unirefund/ContractService/action";
import {getBaseLink} from "@/utils";
import {ProcessingFeeDetailsField} from "../../_components/processing-fee-details";
import {RebateTableDetailsField} from "../../_components/rebate-table-details-field";

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
    },
  });

  return (
    <div className="flex flex-col overflow-hidden">
      <ActionList className="items-center">
        <span className="ml-auto text-sm">{languageData["Contracts.FillFrom"]}</span>
        <Combobox<RebateTableHeaderListDto>
          classNames={{container: "w-52"}}
          emptyValue={languageData["Select.EmptyValue"]}
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
        disabled={isPending}
        fields={{
          RebateTableDetailsField: RebateTableDetailsField({
            data: formData.rebateTableDetails !== null ? formData.rebateTableDetails : [],
            languageData,
          }),
          ProcessingFeeDetailsField: ProcessingFeeDetailsField({
            data: formData.processingFeeDetails !== null ? formData.processingFeeDetails : [],
            languageData,
          }),
        }}
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
                suffix: "",
              });
            });
          });
        }}
        schema={$RebateTableHeaderCreateDto}
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
    </div>
  );
}
