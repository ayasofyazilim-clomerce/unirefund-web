"use client";

import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import type {
  UniRefund_TravellerService_Telephones_TelephoneUpSertDto as TelephoneUpSertDto,
  UniRefund_TravellerService_Telephones_TelephoneDto as TelephoneDto,
} from "@repo/saas/TravellerService";
import {
  $UniRefund_TravellerService_Telephones_TelephoneUpSertDto as $TelephoneUpSertDto,
  $UniRefund_TravellerService_Telephones_TelephoneDto as $TelephoneDto,
} from "@repo/saas/TravellerService";
import {putTravellerTelephonesByTravellerIdApi} from "@repo/actions/unirefund/TravellerService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import type {TravellerServiceResource} from "@/language-data/unirefund/TravellerService";
import {PhoneWithTypeField} from "./phone-with-type";

export function PhoneForm({languageData, phones}: {languageData: TravellerServiceResource; phones: TelephoneDto[]}) {
  const {lang, travellerId} = useParams<{lang: string; travellerId: string}>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const columns = tanstackTableCreateColumnsByRowData<TelephoneDto>({
    rows: $TelephoneDto.properties,
    config: {
      locale: lang,
    },
    languageData: {
      languageData,
      constantKey: "Form.telephone",
    },
    custom: {
      isPrimary: {
        showHeader: true,
        content: (row) =>
          IsPrimaryAction({row, travellerId, isPending, startTransition, languageData, isActive: phones.length === 1}),
      },
      type: {
        showHeader: true,
        content: (row) => TypeRow({row, languageData}),
      },
    },
    expandRowTrigger: "fullNumber",
  });
  const tableActions: TanstackTableTableActionsType<TelephoneDto>[] = [
    {
      actionLocation: "table",
      cta: languageData["Form.telephone.create"],
      type: "schemaform-dialog",
      schema: $TelephoneUpSertDto,
      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $TelephoneUpSertDto,
        name: "Form.telephone",
        extend: {"ui:field": "telephone"},
      }),
      fields: {
        telephone: PhoneWithTypeField({languageData, typeOptions: $TelephoneUpSertDto.properties.type.enum}),
      },
      formData: {
        type: "HOME",
      },
      withScrollArea: false,
      disabled: isPending,
      filter: {type: "exclude", keys: ["telephoneId", "isPrimary"]},
      submitText: languageData["Form.telephone.create"],
      title: languageData["Form.telephone.create"],
      onSubmit: (formData) => {
        if (!formData) return;
        const data = {
          id: travellerId,
          requestBody: {
            isPrimary: phones.length === 0,
            ...formData,
          },
        };
        startTransition(() => {
          void putTravellerTelephonesByTravellerIdApi(data).then((response) => {
            handlePutResponse(response, router);
          });
        });
      },
    },
  ];
  return (
    <TanstackTable
      columnVisibility={{
        columns: ["fullNumber", "isPrimary", "type"],
        type: "show",
      }}
      columns={columns}
      data={phones}
      expandedRowComponent={(row) => EditForm({row, lang, languageData, travellerId, isPending, startTransition})}
      fillerColumn="fullNumber"
      showPagination={false}
      tableActions={tableActions}
      title={languageData["Form.telephones"]}
    />
  );
}

function TypeRow({row, languageData}: {row: TelephoneUpSertDto; languageData: TravellerServiceResource}) {
  return <div> {(row.type && languageData[`Form.telephone.type.${row.type}`]) || row.type}</div>;
}

function EditForm({
  row,
  lang,
  travellerId,
  languageData,
  isPending,
  startTransition,
}: {
  row: TelephoneUpSertDto;
  lang: string;
  travellerId: string;
  languageData: TravellerServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) {
  const router = useRouter();
  return (
    <SchemaForm<TelephoneUpSertDto>
      defaultSubmitClassName="p-2 pt-0"
      disabled={isPending}
      fields={{
        telephone: PhoneWithTypeField({languageData, typeOptions: $TelephoneUpSertDto.properties.type.enum}),
      }}
      filter={{type: "exclude", keys: ["id", "isPrimary"]}}
      formData={row}
      key={JSON.stringify(row)}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        const data = {
          id: travellerId,
          requestBody: {
            telephoneId: row.telephoneId,
            ...formData,
          },
        };
        startTransition(() => {
          void putTravellerTelephonesByTravellerIdApi(data).then((response) => {
            handlePutResponse(response, router);
          });
        });
      }}
      schema={$TelephoneUpSertDto}
      submitText={languageData["Form.telephone.update"]}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $TelephoneUpSertDto,
        name: "Form.telephone",
        extend: {
          "ui:className": "p-2 bg-white",
          "ui:field": "telephone",
        },
      })}
      withScrollArea={false}
    />
  );
}

function IsPrimaryAction({
  row,
  travellerId,
  isActive,
  isPending,
  startTransition,
  languageData,
}: {
  row: TelephoneUpSertDto;
  travellerId: string;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: TravellerServiceResource;
}) {
  const switchComponent = (
    <Switch
      checked={row.isPrimary === true}
      disabled={isActive || isPending}
      onCheckedChange={() => {
        startTransition(() => {
          void putTravellerTelephonesByTravellerIdApi({
            id: travellerId,
            requestBody: {
              telephoneId: row.telephoneId,
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
        <TooltipContent>{languageData["Messages.telephone.isPrimary.atLeastOnePrimaryRequired"]}</TooltipContent>
      </Tooltip>
    );
  }

  return <div className="flex items-center justify-center">{switchComponent}</div>;
}
