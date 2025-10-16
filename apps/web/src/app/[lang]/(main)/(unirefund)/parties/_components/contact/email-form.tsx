"use client";

import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {
  UniRefund_CRMService_Emails_EmailDto as EmailDto,
  UniRefund_CRMService_Emails_EmailUpSertDto as EmailUpSertDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_Emails_EmailDto as $EmailDto,
  $UniRefund_CRMService_Emails_EmailUpSertDto as $EmailUpSertDto,
} from "@repo/saas/CRMService";
import {Edit} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import type {DefaultResource} from "@/language-data/core/Default";
import {useTenant} from "@/providers/tenant";
import type {PartyType} from "../party-header";
import {emailActionByPartyType} from "./utils";

export function EmailForm({
  languageData,
  emails,
  partyType,
}: {
  languageData: DefaultResource;
  emails: EmailDto[];
  partyType: PartyType;
}) {
  const router = useRouter();
  const {partyId} = useParams<{lang: string; partyId: string}>();
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
            partyId,
            partyType,
            isPending,
            startTransition,
            languageData,
            isActive: emails.length === 1 && row.isPrimary,
            router,
          }),
      },
      type: {
        showHeader: true,
        content: (row) => TypeRow({row, languageData}),
      },
      emailAddress: {
        showHeader: true,
        content: (row) => EditRowTrigger({row}),
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
        emailAddress: "",
        isPrimary: false,
      },
      withScrollArea: false,
      disabled: isPending,
      filter: {type: "exclude", keys: ["id", "isPrimary"]},
      submitText: languageData["Form.email.create"],
      title: languageData["Form.email.create"],
      onSubmit: (editedFormData) => {
        startTransition(() => {
          emailActionByPartyType({partyId, partyType, requestBody: {...editedFormData, isPrimary: false}, router});
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
      expandedRowComponent={(row) =>
        EditForm({row, languageData, isPending, startTransition, partyId, partyType, router})
      }
      fillerColumn="emailAddress"
      resizeable={false}
      showPagination={false}
      tableActions={tableActions}
      title={languageData["Form.emails"]}
    />
  );
}

function TypeRow({row, languageData}: {row: EmailDto; languageData: DefaultResource}) {
  return <div> {languageData[`Form.email.type.${row.type}`]}</div>;
}
function EditRowTrigger({row}: {row: EmailDto}) {
  return (
    <div className="flex items-center gap-1">
      <Edit className="w-4" />
      {row.emailAddress}
    </div>
  );
}
function EditForm({
  row,
  partyId,
  partyType,
  languageData,
  isPending,
  startTransition,
  router,
}: {
  row: EmailDto;
  partyId: string;
  partyType: PartyType;
  languageData: DefaultResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  router: AppRouterInstance;
}) {
  return (
    <SchemaForm<EmailUpSertDto>
      defaultSubmitClassName="p-2 pt-0"
      disabled={isPending}
      filter={{type: "exclude", keys: ["emailId", "isPrimary"]}}
      formData={row}
      id="edit-email-form"
      key={JSON.stringify(row)}
      onSubmit={({formData: editedFormData}) => {
        if (!editedFormData) return;
        startTransition(() => {
          emailActionByPartyType({partyId, partyType, requestBody: {...editedFormData, emailId: row.id}, router});
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
          "ui:className": "border-none p-2 rounded-none",
          emailAddress: {
            "ui:title": languageData["Form.email"],
            "ui:widget": "email",
            "ui:baseList": ["unirefund.com", "clomerce.com", "ayasofyazilim.com"],
          },
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
  row: EmailDto;
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
      checked={row.isPrimary}
      data-testid="email-is-primary"
      disabled={isActive || isPending}
      onCheckedChange={(value) => {
        startTransition(() => {
          emailActionByPartyType({partyId, partyType, requestBody: {isPrimary: value, emailId: row.id}, router});
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
