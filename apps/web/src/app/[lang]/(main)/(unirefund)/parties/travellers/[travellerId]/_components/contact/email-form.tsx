"use client";

import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import type {UniRefund_TravellerService_Emails_EmailDto as EmailDto} from "@ayasofyazilim/unirefund-saas-dev/TravellerService";
import {$UniRefund_TravellerService_Emails_EmailDto as $EmailDto} from "@ayasofyazilim/unirefund-saas-dev/TravellerService";
import {putTravellerEmailsByTravellerIdApi} from "@repo/actions/unirefund/TravellerService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePostResponse, handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import type {DefaultResource} from "@/language-data/core/Default";
import {EmailWithTypeField} from "./email-with-type";

export function EmailForm({languageData, emails}: {languageData: DefaultResource; emails: EmailDto[]}) {
  const router = useRouter();
  const {lang, travellerId} = useParams<{lang: string; travellerId: string}>();
  const [isPending, startTransition] = useTransition();

  const columns = tanstackTableCreateColumnsByRowData<EmailDto>({
    rows: $EmailDto.properties,
    config: {
      locale: lang,
    },
    languageData: {
      languageData,
      constantKey: "Form.email",
    },
    custom: {
      isPrimary: {
        showHeader: true,
        content: (row) =>
          IsPrimaryAction({row, travellerId, isPending, startTransition, languageData, isActive: emails.length === 1}),
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
      id: "create-email",
      actionLocation: "table",
      cta: languageData["Form.email.create"],
      type: "schemaform-dialog",
      schema: $EmailDto,

      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $EmailDto,
        name: "Form.email",
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
      submitText: languageData["Form.email.create"],
      title: languageData["Form.email.create"],
      onSubmit: (formData) => {
        if (!formData) return;
        startTransition(() => {
          void putTravellerEmailsByTravellerIdApi({
            id: travellerId,
            requestBody: {
              emailAddress: formData.emailAddress || "",
              type: formData.type,
              isPrimary: emails.length === 0,
            },
          }).then((response) => {
            handlePostResponse(response, router);
          });
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
      expandedRowComponent={(row) => EditForm({row, languageData, travellerId, isPending, startTransition})}
      fillerColumn="emailAddress"
      showPagination={false}
      tableActions={tableActions}
      title={languageData["Form.emails"]}
    />
  );
}
function TypeRow({row, languageData}: {row: EmailDto; languageData: DefaultResource}) {
  return <div> {(row.type && languageData[`Form.email.type.${row.type}`]) || row.type}</div>;
}

function EditForm({
  row,
  travellerId,
  languageData,
  isPending,
  startTransition,
}: {
  row: EmailDto;
  travellerId: string;
  languageData: DefaultResource;
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
      id="edit-email-form"
      key={JSON.stringify(row)}
      onSubmit={({formData}) => {
        if (!formData) return;
        const data = {
          id: travellerId,
          requestBody: {
            emailId: row.id,
            emailAddress: formData.emailAddress !== row.emailAddress ? formData.emailAddress : undefined,
            type: formData.type !== row.type ? formData.type : undefined,
          },
        };
        startTransition(() => {
          void putTravellerEmailsByTravellerIdApi(data).then((response) => {
            handlePutResponse(response);
          });
        });
      }}
      schema={$EmailDto}
      submitText={languageData["Form.email.update"]}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $EmailDto,
        name: "Form.email",
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
  travellerId,
  isActive,
  isPending,
  startTransition,
  languageData,
}: {
  row: EmailDto;
  travellerId: string;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: DefaultResource;
}) {
  const switchComponent = (
    <Switch
      checked={row.isPrimary === true}
      data-testid="email-is-primary"
      disabled={isActive || isPending}
      onCheckedChange={() => {
        startTransition(() => {
          void putTravellerEmailsByTravellerIdApi({
            id: travellerId,
            requestBody: {
              emailId: row.id,
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
        <TooltipContent>{languageData["Messages.address.isPrimary.atLeastOnePrimaryRequired"]}</TooltipContent>
      </Tooltip>
    );
  }

  return <div className="flex items-center justify-center">{switchComponent}</div>;
}
