"use client";

import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {
  UniRefund_CRMService_Telephones_TelephoneDto as TelephoneDto,
  UniRefund_CRMService_Telephones_TelephoneUpsertDto as TelephoneUpSertDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_Telephones_TelephoneDto as $TelephoneDto,
  $UniRefund_CRMService_Telephones_TelephoneUpsertDto as $TelephoneUpSertDto,
} from "@repo/saas/CRMService";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import {Edit} from "lucide-react";
import type {DefaultResource} from "@/language-data/core/Default";
import {useTenant} from "@/providers/tenant";
import type {PartyType} from "../party-header";
import {PhoneWithTypeField} from "./phone-with-type";
import {telephoneActionByPartyType} from "./utils";

export function PhoneForm({
  languageData,
  phones,
  partyType,
}: {
  languageData: DefaultResource;
  phones: TelephoneDto[];
  partyType: PartyType;
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
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
      type: {
        showHeader: true,
        content: (row) => TypeRow({row, languageData}),
      },
      isPrimary: {
        showHeader: true,
        content: (row) =>
          IsPrimaryAction({
            row,
            partyId,
            isPending,
            startTransition,
            languageData,
            isActive: phones.length === 1 && row.isPrimary,
            partyType,
            router,
          }),
      },
      normalizedPhoneNumber: {
        showHeader: true,
        content: (row) => EditRowTrigger({row}),
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
        extend: {"ui:field": "telephone", "ui:className": "items-stretch"},
      }),
      fields: {
        telephone: PhoneWithTypeField({languageData, typeOptions: $TelephoneUpSertDto.properties.type.enum}),
      },
      withScrollArea: false,
      disabled: isPending,
      filter: {type: "exclude", keys: ["telephoneId", "isPrimary"]},
      submitText: languageData["Form.telephone.create"],
      title: languageData["Form.telephone.create"],
      onSubmit: (editedFormData) => {
        if (!editedFormData) return;
        startTransition(() => {
          telephoneActionByPartyType({
            requestBody: {...editedFormData, isPrimary: phones.length === 0},
            partyType,
            partyId,
            router,
          });
        });
      },
    },
  ];
  return (
    <TanstackTable
      columnOrder={["normalizedPhoneNumber", "type", "isPrimary"]}
      columnVisibility={{
        columns: ["normalizedPhoneNumber", "type", "isPrimary"],
        type: "show",
      }}
      columns={columns}
      data={phones}
      expandedRowComponent={(row) =>
        EditForm({row, lang, languageData, partyId, partyType, isPending, startTransition})
      }
      fillerColumn="normalizedPhoneNumber"
      showPagination={false}
      tableActions={tableActions}
      title={languageData["Form.telephones"]}
    />
  );
}

function TypeRow({row, languageData}: {row: TelephoneDto; languageData: DefaultResource}) {
  return <div> {languageData[`Form.telephone.type.${row.type}`]}</div>;
}
function EditRowTrigger({row}: {row: TelephoneDto}) {
  return (
    <div className="flex items-center gap-1">
      <Edit className="w-4" />
      {row.normalizedPhoneNumber}
    </div>
  );
}
function EditForm({
  row,
  lang,
  partyId,
  partyType,
  languageData,
  isPending,
  startTransition,
}: {
  row: TelephoneDto;
  lang: string;
  partyId: string;
  partyType: PartyType;
  languageData: DefaultResource;
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
      filter={{type: "exclude", keys: ["telephoneId", "isPrimary"]}}
      formData={row}
      id="edit-telephone-form"
      key={JSON.stringify(row)}
      locale={lang}
      onSubmit={({formData: editedFormData}) => {
        if (!editedFormData) return;
        startTransition(() => {
          telephoneActionByPartyType({
            requestBody: {...editedFormData, telephoneId: row.id},
            partyType,
            partyId,
            router,
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
  partyId,
  partyType,
  isActive,
  isPending,
  startTransition,
  languageData,
  router,
}: {
  row: TelephoneDto;
  partyId: string;
  partyType: PartyType;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: DefaultResource;
  router: AppRouterInstance;
}) {
  const switchComponent = (
    <Switch
      checked={row.isPrimary ? row.isPrimary : false}
      data-testid="phone-is-primary"
      disabled={isActive || isPending}
      onCheckedChange={(value) => {
        startTransition(() => {
          telephoneActionByPartyType({
            requestBody: {isPrimary: value, telephoneId: row.id},
            partyType,
            partyId,
            router,
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
