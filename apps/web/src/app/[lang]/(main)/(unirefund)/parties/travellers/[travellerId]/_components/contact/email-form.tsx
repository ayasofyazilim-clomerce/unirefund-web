"use client";

import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import type {
  UniRefund_TravellerService_Emails_EmailDto as EmailDto,
  UniRefund_TravellerService_Emails_EmailUpSertDto as EmailUpSertDto,
} from "@ayasofyazilim/unirefund-saas-dev/TravellerService";
import {
  $UniRefund_TravellerService_Emails_EmailDto as $EmailDto,
  $UniRefund_TravellerService_Emails_EmailUpSertDto as $EmailUpSertDto,
} from "@ayasofyazilim/unirefund-saas-dev/TravellerService";
import {putTravellerEmailsByTravellerIdApi} from "@repo/actions/unirefund/TravellerService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePostResponse, handlePutResponse} from "@repo/utils/api";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import {useTenant} from "@/providers/tenant";
import type {DefaultResource} from "@/language-data/core/Default";

export function EmailForm({languageData, emails}: {languageData: DefaultResource; emails: EmailDto[]}) {
  const router = useRouter();
  const {travellerId} = useParams<{travellerId: string}>();
  const [isPending, startTransition] = useTransition();
  const {localization} = useTenant();

  const columns = tanstackTableCreateColumnsByRowData<EmailDto>({
    rows: $EmailDto.properties,
    localization,
    languageData: {
      languageData,
      constantKey: "Form.email",
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
            isActive: emails.length === 1,
            router,
          }),
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
      schema: $EmailUpSertDto,
      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $EmailUpSertDto,
        name: "Form.email",
        extend: {
          "ui:className": "p-px border-none rounded-none",
          displayLabel: false,
          emailAddress: {
            "ui:title": languageData["Form.email"],
            "ui:widget": "email",
            "ui:baseList": ["unirefund.com", "clomerce.com", "ayasofyazilim.com"],
          },
        },
      }),
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
      expandedRowComponent={(row) => EditForm({row, languageData, travellerId, isPending, startTransition, router})}
      fillerColumn="emailAddress"
      resizeable={false}
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
  router,
}: {
  row: EmailDto;
  travellerId: string;
  languageData: DefaultResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  router: AppRouterInstance;
}) {
  return (
    <SchemaForm<EmailUpSertDto>
      defaultSubmitClassName="p-2 pt-0"
      disabled={isPending}
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
            handlePutResponse(response, router);
          });
        });
      }}
      schema={$EmailUpSertDto}
      submitText={languageData["Form.email.update"]}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $EmailUpSertDto,
        name: "Form.email",
        extend: {
          displayLabel: false,
          "ui:className": "p-2 bg-white rounded-none border-none",
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
  router,
}: {
  row: EmailDto;
  travellerId: string;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: DefaultResource;
  router: AppRouterInstance;
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
        <TooltipContent>{languageData["Messages.address.isPrimary.atLeastOnePrimaryRequired"]}</TooltipContent>
      </Tooltip>
    );
  }

  return <div className="flex items-center justify-center">{switchComponent}</div>;
}
