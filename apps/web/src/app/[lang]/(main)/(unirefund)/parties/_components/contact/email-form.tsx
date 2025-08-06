"use client";

import {toast} from "@/components/ui/sonner";
import {Switch} from "@/components/ui/switch";
import type {UniRefund_CRMService_Emails_EmailDto as EmailDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {$UniRefund_CRMService_Emails_EmailDto as $EmailDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {putMerchantEmailsByMerchantIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {EmailWithTypeField} from "./email-with-type";

export function EmailForm({languageData, emails}: {languageData: CRMServiceServiceResource; emails: EmailDto[]}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const [isPending, startTransition] = useTransition();

  const columns = tanstackTableCreateColumnsByRowData<EmailDto>({
    rows: $EmailDto.properties,
    config: {
      locale: lang,
    },
    languageData: {
      languageData,
      constantKey: "CRM.email",
    },
    custom: {
      isPrimary: {
        showHeader: true,
        content: (row) =>
          IsPrimaryAction({row, partyId, isPending, startTransition, languageData, isActive: emails.length === 1}),
      },
      type: {
        showHeader: true,
        content: (row) => TypeRow({row, languageData}),
      },
    },
    expandRowTrigger: "emailAddress",
  });
  const tableActions: TanstackTableTableActionsType<EmailDto>[] = [
    {
      actionLocation: "table",
      cta: languageData["CRM.email.create"],
      type: "schemaform-dialog",
      schema: $EmailDto,

      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $EmailDto,
        name: "CRM.email",
        extend: {"ui:field": "email"},
      }),
      fields: {
        email: EmailWithTypeField({languageData}),
      },
      formData: {
        type: "WORK",
      },
      withScrollArea: false,
      disabled: isPending,
      filter: {type: "exclude", keys: ["id", "isPrimary"]},
      submitText: languageData["CRM.email.create"],
      title: languageData["CRM.email.create"],
      onSubmit: () => {
        startTransition(() => {
          toast.error(languageData.NotImplemented);
        });
      },
    },
  ];

  return (
    <TanstackTable
      columnVisibility={{
        columns: ["id"],
        type: "hide",
      }}
      columns={columns}
      data={emails}
      expandedRowComponent={(row) => EditForm({row, languageData, partyId, isPending, startTransition})}
      fillerColumn="emailAddress"
      showPagination={false}
      tableActions={tableActions}
    />
  );
}
function TypeRow({row, languageData}: {row: EmailDto; languageData: CRMServiceServiceResource}) {
  return <div> {(row.type && languageData[`CRM.email.type.${row.type}`]) || row.type}</div>;
}

function EditForm({
  row,
  partyId,
  languageData,
  isPending,
  startTransition,
}: {
  row: EmailDto;
  partyId: string;
  languageData: CRMServiceServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) {
  return (
    <SchemaForm<EmailDto>
      defaultSubmitClassName="p-2 pt-0"
      disabled={isPending}
      fields={{
        email: EmailWithTypeField({languageData}),
      }}
      filter={{type: "exclude", keys: ["id", "isPrimary"]}}
      formData={row}
      key={JSON.stringify(row)}
      onSubmit={({formData}) => {
        if (!formData) return;
        const data = {
          merchantId: partyId,
          requestBody: {
            id: row.id,
            emailAddress: formData.emailAddress !== row.emailAddress ? formData.emailAddress : undefined,
            type: formData.type !== row.type ? formData.type : undefined,
          },
        };
        startTransition(() => {
          void putMerchantEmailsByMerchantIdApi(data).then((response) => {
            handlePutResponse(response);
          });
        });
      }}
      schema={$EmailDto}
      submitText={languageData["CRM.email.update"]}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $EmailDto,
        name: "CRM.email",
        extend: {
          "ui:className": "p-2 bg-white",
          "ui:field": "email",
        },
      })}
      withScrollArea={false}
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
  row: EmailDto;
  partyId: string;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: CRMServiceServiceResource;
}) {
  const switchComponent = (
    <Switch
      checked={row.isPrimary === true}
      disabled={isActive || isPending}
      onCheckedChange={() => {
        startTransition(() => {
          void putMerchantEmailsByMerchantIdApi({
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
        <TooltipContent>{languageData["CRM.Messages.address.isPrimary.atLeastOnePrimaryRequired"]}</TooltipContent>
      </Tooltip>
    );
  }

  return <div className="flex items-center justify-center">{switchComponent}</div>;
}
