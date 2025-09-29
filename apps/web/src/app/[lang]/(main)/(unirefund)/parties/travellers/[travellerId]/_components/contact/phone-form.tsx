"use client";

import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {putTravellerTelephonesByTravellerIdApi} from "@repo/actions/unirefund/TravellerService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {
  UniRefund_TravellerService_Telephones_TelephoneDto as TelephoneDto,
  UniRefund_TravellerService_Telephones_TelephoneUpSertDto as TelephoneUpSertDto,
} from "@repo/saas/TravellerService";
import {
  $UniRefund_TravellerService_Telephones_TelephoneDto as $TelephoneDto,
  $UniRefund_TravellerService_Telephones_TelephoneUpSertDto as $TelephoneUpSertDto,
} from "@repo/saas/TravellerService";
import {handlePutResponse} from "@repo/utils/api";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import type {TravellerServiceResource} from "@/language-data/unirefund/TravellerService";
import {useTenant} from "@/providers/tenant";
import {PhoneWithTypeField} from "../../../../_components/contact/phone-with-type";

export function PhoneForm({languageData, phones}: {languageData: TravellerServiceResource; phones: TelephoneDto[]}) {
  const {lang, travellerId} = useParams<{lang: string; travellerId: string}>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {localization} = useTenant();

  const columns = tanstackTableCreateColumnsByRowData<TelephoneDto>({
    rows: $TelephoneDto.properties,
    localization,
    languageData: {
      languageData,
      constantKey: "Form.telephone",
    },
    custom: {
      isPrimary: {
        showHeader: true,
        content: (row) =>
          IsPrimaryAction({
            row,
            travellerId,
            isPending,
            startTransition,
            languageData,
            isActive: phones.length === 1,
            router,
          }),
      },
      type: {
        showHeader: true,
        content: (row) => TypeRow({row, languageData}),
      },
    },
    expandRowTrigger: "normalizedPhoneNumber",
  });
  const tableActions: TanstackTableTableActionsType<TelephoneDto>[] = [
    {
      id: "create-telephone",
      actionLocation: "table",
      cta: languageData["Form.telephone.create"],
      type: "schemaform-dialog",
      schema: $TelephoneUpSertDto,
      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $TelephoneUpSertDto,
        name: "Form.telephone",
        extend: {"ui:field": "telephone", "ui:className": "items-stretch gap-2"},
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
        columns: ["normalizedPhoneNumber", "isPrimary", "type"],
        type: "show",
      }}
      columns={columns}
      data={phones}
      expandedRowComponent={(row) => EditForm({row, lang, languageData, travellerId, isPending, startTransition})}
      fillerColumn="normalizedPhoneNumber"
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
  row: TelephoneDto;
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
      filter={{type: "include", keys: ["ituCountryCode", "localNumber", "type"]}}
      formData={row}
      id="edit-telephone-form"
      key={JSON.stringify(row)}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        const data = {
          id: travellerId,
          requestBody: {
            telephoneId: row.id,
            ituCountryCode: formData.ituCountryCode,
            localNumber: formData.localNumber,
            type: formData.type,
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
          "ui:className": "p-2 bg-white items-stretch",
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
  router,
}: {
  row: TelephoneDto;
  travellerId: string;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: TravellerServiceResource;
  router: AppRouterInstance;
}) {
  const switchComponent = (
    <Switch
      checked={row.isPrimary === true}
      data-testid="phone-is-primary"
      disabled={isActive || isPending}
      onCheckedChange={() => {
        startTransition(() => {
          void putTravellerTelephonesByTravellerIdApi({
            id: travellerId,
            requestBody: {
              telephoneId: row.id,
              isPrimary: !row.isPrimary,
            },
          }).then((response) => {
            handlePutResponse(response, router);
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
