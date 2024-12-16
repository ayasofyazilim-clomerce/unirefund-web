"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  UniRefund_ContractService_Rebates_ProcessingFeeDetails_ProcessingFeeDetailCreateDto as ProcessingFeeDetailCreateDto,
  UniRefund_ContractService_Rebates_RebateTableDetails_RebateTableDetailCreateDto as RebateTableDetailCreateDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderCreateDto as RebateTableHeaderCreateDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as RebateTableHeaderDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderUpdateDto as RebateTableHeaderUpdateDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderNotTemplateCreateDto as RebateTableHeaderNotTemplateCreateDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $UniRefund_ContractService_Rebates_ProcessingFeeDetails_ProcessingFeeDetailCreateDto as $ProcessingFeeDetailCreateDto,
  $UniRefund_ContractService_Rebates_RebateTableDetails_RebateTableDetailCreateDto as $RebateTableDetailCreateDto,
  $UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderCreateDto as $RebateTableHeaderCreateDto,
  $UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderUpdateDto as $RebateTableHeaderUpdateDto,
  $UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderNotTemplateCreateDto as $RebateTableHeaderNotTemplateCreateDto,
} from "@ayasofyazilim/saas/ContractService";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  handlePostResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import { postRebateTableHeadersApi } from "src/actions/unirefund/ContractService/post-actions";
import { putRebateTableHeadersApi } from "src/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

type RebateFormProps = {
  languageData: ContractServiceResource;
} & (RebateFormCreateProps | RebateFormUpdateProps | RebateFormAddProps);
interface RebateFormCreateProps {
  formType: "create";
}
interface RebateFormUpdateProps {
  formType: "update";
  id: string;
  formData: RebateTableHeaderDto;
}

interface RebateFormAddProps {
  formType: "add";
  id?: string;
  formData?: RebateTableHeaderNotTemplateCreateDto;
  onSubmit: (data: RebateTableHeaderDto) => void;
  children?: React.ReactNode;
}

export default function RebateForm(props: RebateFormProps) {
  const { languageData } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isCreate = props.formType === "create";
  const $Schema = {
    create: $RebateTableHeaderCreateDto,
    update: $RebateTableHeaderUpdateDto,
    add: $RebateTableHeaderNotTemplateCreateDto,
  };
  const formData = {
    create: {},
    update: props.formType === "update" && props.formData,
    add: props.formType === "add" && props.formData,
  };
  const RebateTableColumns =
    tanstackTableEditableColumnsByRowData<RebateTableDetailCreateDto>({
      rows: {
        ...$RebateTableDetailCreateDto.properties,
        refundMethod: {
          ...$RebateTableDetailCreateDto.properties.refundMethod,
          enum: $RebateTableDetailCreateDto.properties.refundMethod.enum.map(
            (item) => ({
              value: item,
              label: item,
            }),
          ),
        },
        variableFee: {
          ...$RebateTableDetailCreateDto.properties.variableFee,
          enum: $RebateTableDetailCreateDto.properties.variableFee.enum.map(
            (item) => ({
              value: item,
              label: item,
            }),
          ),
        },
      },
      languageData: {
        constantKey: "Rebate.Form.rebateTableDetails",
        languageData,
      },
      excludeColumns: ["extraProperties"],
    });
  const ProcessingFeeDetailsColumns =
    tanstackTableEditableColumnsByRowData<ProcessingFeeDetailCreateDto>({
      rows: $ProcessingFeeDetailCreateDto.properties,
      languageData: {
        constantKey: "Rebate.Form.processingFeeDetails",
        languageData,
      },
      excludeColumns: ["extraProperties"],
    });
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    schema: $Schema[props.formType],
    name: "Rebate.Form",
    extend: {
      "ui:className": "md:grid md:grid-cols-2 md:gap-4",
      name: { "ui:className": "md:col-span-2" },
      rebateTableDetails: {
        "ui:field": "RebateTable",
        "ui:className": props.formType === "add" && "md:col-span-full",
      },
      processingFeeDetails: {
        "ui:field": "ProcessingFeeDetails",
        "ui:className": props.formType === "add" && "md:col-span-full",
      },
      isTemplate: {
        "ui:widget": "switch",
        "ui:className": "border rounded-md px-2",
        "ui:options": {
          disabled: true,
        },
      },
      calculateNetCommissionInsteadOfRefund: {
        "ui:widget": "switch",
        "ui:className": cn(
          "border rounded-md px-2",
          (props.formType === "create" || props.formType === "add") &&
            "md:col-span-full",
        ),
      },
    },
  });

  return (
    <SchemaForm
      disabled={loading}
      fields={{
        RebateTable: TableField<RebateTableDetailCreateDto>({
          editable: true,
          columns: RebateTableColumns,
          data: isCreate ? [] : props.formData?.rebateTableDetails || [],
          fillerColumn: "refundMethod",
          columnOrder: [
            "refundMethod",
            "fixedFeeValue",
            "percentFeeValue",
            "variableFee",
          ],
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
              icon: Trash2,
              type: "delete-row",
            },
          ],
        }),
        ProcessingFeeDetails: TableField<ProcessingFeeDetailCreateDto>({
          editable: true,
          columns: ProcessingFeeDetailsColumns,
          data:
            props.formType === "create"
              ? []
              : props.formData?.processingFeeDetails || [],
          fillerColumn: "name",
          tableActions: [
            {
              type: "create-row",
              actionLocation: "table",
              cta: languageData["Rebate.Form.processingFeeDetails.add"],
              icon: PlusCircle,
            },
          ],
          rowActions: [
            {
              actionLocation: "row",
              cta: languageData["Rebate.Form.processingFeeDetails.delete"],
              icon: Trash2,
              type: "delete-row",
            },
          ],
        }),
      }}
      filter={{
        type: "include",
        sort: true,
        keys: [
          "name",
          "calculateNetCommissionInsteadOfRefund",
          "validFrom",
          "validTo",
          "*rebateTableDetails",
          "*processingFeeDetails",
        ],
      }}
      formData={formData[props.formType]}
      onSubmit={(data) => {
        setLoading(true);
        if (props.formType === "create") {
          void postRebateTableHeadersApi({
            requestBody: data.formData as RebateTableHeaderCreateDto,
          }).then((response) => {
            handlePostResponse(response, router, "../rebate");
          });
        } else if (props.formType === "update") {
          void putRebateTableHeadersApi({
            id: props.id,
            requestBody: data.formData as RebateTableHeaderUpdateDto,
          }).then((response) => {
            handlePutResponse(response, router);
          });
        } else {
          if (!data.formData) return;
          props.onSubmit(data.formData as RebateTableHeaderDto);
        }
        setLoading(false);
      }}
      schema={$Schema[props.formType]}
      uiSchema={uiSchema}
      useDefaultSubmit={false}
    >
      <div className="sticky bottom-0 z-50 flex justify-end gap-2 bg-white py-4">
        {props.formType === "add" ? (
          props.children
        ) : (
          <Button type="submit">
            {props.formType === "create" &&
              languageData["Rebate.Create.Submit"]}
            {props.formType === "update" &&
              languageData["Rebate.Update.Submit"]}
          </Button>
        )}
      </div>
    </SchemaForm>
  );
}
