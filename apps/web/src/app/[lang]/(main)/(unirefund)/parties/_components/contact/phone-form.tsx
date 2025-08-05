"use client";

import {toast} from "@/components/ui/sonner";
import {Switch} from "@/components/ui/switch";
import {
  $UniRefund_CRMService_Telephones_TelephoneDto as $TelephoneDto,
  UniRefund_CRMService_Telephones_TelephoneDto as TelephoneDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {putMerchantTelephonesByMerchantIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {PhoneWithTypeField} from "./phone-with-type";

import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {TransitionStartFunction, useTransition} from "react";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
export function PhoneForm({languageData, phones}: {languageData: CRMServiceServiceResource; phones: TelephoneDto[]}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const [isPending, startTransition] = useTransition();

  const columns = tanstackTableCreateColumnsByRowData<TelephoneDto>({
    rows: $TelephoneDto.properties,
    config: {
      locale: lang,
    },
    languageData: {
      languageData,
      constantKey: "CRM.telephone",
    },
    custom: {
      isPrimary: {
        showHeader: true,
        content: (row) =>
          IsPrimaryAction({row, partyId, isPending, startTransition, languageData, isActive: phones.length === 1}),
      },
      type: {
        showHeader: true,
        content: (row) => <div> {(row.type && languageData[`CRM.telephone.type.${row.type}`]) || row.type}</div>,
      },
    },
    expandRowTrigger: "number",
  });
  const tableActions: TanstackTableTableActionsType<TelephoneDto>[] = [
    {
      actionLocation: "table",
      cta: languageData["CRM.telephone.create"],
      type: "schemaform-dialog",
      schema: $TelephoneDto,
      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $TelephoneDto,
        name: "CRM.telephone",
        extend: {"ui:field": "telephone"},
      }),
      fields: {
        telephone: PhoneWithTypeField({languageData}),
      },
      formData: {
        type: "WORK",
      },
      withScrollArea: false,
      disabled: isPending,
      filter: {type: "exclude", keys: ["id", "isPrimary"]},
      submitText: languageData["CRM.telephone.create"],
      title: languageData["CRM.telephone.create"],
      onSubmit: () => {
        startTransition(() => {
          toast.error(languageData.NotImplemented);
        });
      },
    },
  ];
  return (
    <TanstackTable
      title={languageData["CRM.telephones"]}
      columnVisibility={{
        columns: ["id"],
        type: "hide",
      }}
      columns={columns}
      data={phones}
      expandedRowComponent={(row) => EditForm({row, lang, languageData, partyId, isPending, startTransition})}
      fillerColumn="number"
      showPagination={false}
      tableActions={tableActions}
    />
  );
}

function EditForm({
  row,
  lang,
  partyId,
  languageData,
  isPending,
  startTransition,
}: {
  row: TelephoneDto;
  lang: string;
  partyId: string;
  languageData: CRMServiceServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) {
  const router = useRouter();
  return (
    <SchemaForm<TelephoneDto>
      key={JSON.stringify(row)}
      locale={lang}
      schema={$TelephoneDto}
      fields={{
        telephone: PhoneWithTypeField({languageData}),
      }}
      withScrollArea={false}
      defaultSubmitClassName="p-2 pt-0"
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $TelephoneDto,
        name: "CRM.telephone",
        extend: {
          "ui:className": "p-2 bg-white",
          "ui:field": "telephone",
        },
      })}
      disabled={isPending}
      filter={{type: "exclude", keys: ["id", "isPrimary"]}}
      formData={row}
      submitText={languageData["CRM.telephone.update"]}
      onSubmit={({formData}) => {
        if (!formData) return;
        const data = {
          merchantId: partyId,
          requestBody: {
            id: row.id,
            number: formData.number != row.number ? formData.number : undefined,
            type: formData.type != row.type ? formData.type : undefined,
          },
        };
        startTransition(() => {
          void putMerchantTelephonesByMerchantIdApi(data).then((response) => {
            handlePutResponse(response, router);
          });
        });
      }}
    />
  );
}

function IsPrimaryAction({
  row,
  partyId,
  isActive,
  isPending,
  startTransition,
  languageData,
}: {
  row: TelephoneDto;
  partyId: string;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: CRMServiceServiceResource;
}) {
  const switchComponent = (
    <Switch
      disabled={isActive || isPending}
      checked={row.isPrimary === true}
      onCheckedChange={() => {
        startTransition(() => {
          void putMerchantTelephonesByMerchantIdApi({
            merchantId: partyId,
            requestBody: {
              id: row.id,
              isPrimary: !row.isPrimary,
            },
          }).then((response) => {
            handlePutResponse(response);
          });
        });
      }}
    />
  );

  if (isActive) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex size-full items-center justify-center">{switchComponent}</div>
        </TooltipTrigger>
        <TooltipContent>{languageData["CRM.Messages.telephone.isPrimary.atLeastOnePrimaryRequired"]}</TooltipContent>
      </Tooltip>
    );
  }

  return <div className="flex items-center justify-center">{switchComponent}</div>;
}
