"use client";
import {Button} from "@/components/ui/button";
import type {Volo_Abp_Identity_IdentityRoleDto as RoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import type {
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {UniRefund_CRMService_Affiliations_AffiliationListResponseDto as AffiliationListResponseDto} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_Affiliations_AffiliationListResponseDto as $AffiliationListResponseDto,
  $UniRefund_CRMService_Affiliations_UpdateAffiliationDto as $UpdateAffiliationDto,
} from "@repo/saas/CRMService";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {PlusCircle, Trash2Icon} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useParams} from "next/navigation";
import type {Dispatch, TransitionStartFunction} from "react";
import {useTransition} from "react";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import type {PartyTypeHasAffiliations} from "../party-header";
import {deleteAffiliationByPartyType, updateAffiliationByPartyType} from "./utils";

type AffiliationTableType = TanstackTableCreationProps<AffiliationListResponseDto>;

function affiliationTableActions(
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
  isUsersAvailable: boolean,
  isRolesAvailable: boolean,
  setOpen: Dispatch<React.SetStateAction<boolean>>,
) {
  const actions: TanstackTableTableActionsType<AffiliationListResponseDto>[] = [
    {
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      condition: () =>
        isActionGranted(["CRMService.Merchants.Create"], grantedPolicies) && isUsersAvailable && isRolesAvailable,
      onClick: () => {
        setOpen(true);
      },
    },
  ];

  return actions;
}

function affiliationColumns(locale: string, languageData: CRMServiceServiceResource) {
  return tanstackTableCreateColumnsByRowData<AffiliationListResponseDto>({
    rows: $AffiliationListResponseDto.properties,
    languageData: {
      name: languageData.Name,
      roleName: languageData["CRM.roleName"],
    },
    config: {
      locale,
    },
    expandRowTrigger: "name",
  });
}

function AffiliationTable(
  partyType: PartyTypeHasAffiliations,
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  roles: RoleDto[],
  isRolesAvailable: boolean,
  isUsersAvailable: boolean,
  setOpen: Dispatch<React.SetStateAction<boolean>>,
) {
  const {partyId} = useParams<{lang: string; partyId: string}>();
  const [isPending, startTransition] = useTransition();

  const table: AffiliationTableType = {
    tableActions: affiliationTableActions(languageData, grantedPolicies, isUsersAvailable, isRolesAvailable, setOpen),
    filters: {
      textFilters: ["name"],
      facetedFilters: isRolesAvailable
        ? {
            roleName: {
              title: languageData["CRM.roleName"],
              options: roles.map((role) => ({
                label: role.name || "",
                value: role.name || "",
              })),
            },
          }
        : undefined,
    },
    expandedRowComponent: (row) =>
      EditForm({
        row,
        partyId,
        partyType,
        languageData,
        roles,
        isPending,
        startTransition,
        router,
      }),
    columnVisibility: {
      type: "show",
      columns: ["name", "roleName"],
    },
  };
  return table;
}

export const tableData = {
  affiliations: {
    columns: affiliationColumns,
    table: AffiliationTable,
  },
};

function EditForm({
  row,
  partyId,
  partyType,
  languageData,
  roles,
  isPending,
  startTransition,
  router,
}: {
  row: AffiliationListResponseDto;
  partyId: string;
  partyType: PartyTypeHasAffiliations;
  languageData: CRMServiceServiceResource;
  roles: RoleDto[];
  isPending: boolean;
  startTransition: TransitionStartFunction;
  router: AppRouterInstance;
}) {
  return (
    <SchemaForm<AffiliationListResponseDto>
      disabled={isPending}
      filter={{type: "include", sort: true, keys: ["abpRoleId", "startDate", "endDate"]}}
      formData={row}
      key={JSON.stringify(row)}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          updateAffiliationByPartyType({
            router,
            affiliationId: row.id || "",
            partyId,
            partyType,
            requestBody: {
              abpRoleId: row.abpRoleId === formData.abpRoleId ? undefined : formData.abpRoleId,
              startDate: row.startDate === formData.startDate ? undefined : formData.startDate,
              endDate: row.endDate === formData.endDate ? undefined : formData.endDate,
            },
          });
        });
      }}
      schema={$UpdateAffiliationDto}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $UpdateAffiliationDto,
        name: "Form.Merchant.affiliation",
        extend: {
          "ui:className": "grid grid-cols-2 border-none rounded-none p-2",
          displayLabel: false,
          abpRoleId: {
            "ui:widget": "roleWidget",
          },
        },
      })}
      useDefaultSubmit={false}
      widgets={{
        roleWidget: CustomComboboxWidget<RoleDto>({
          languageData,
          list: roles,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
      withScrollArea={false}>
      <div className="flex justify-end gap-2 bg-white px-2 pb-2">
        <ConfirmDialog
          closeProps={{children: languageData.Cancel}}
          confirmProps={{
            type: "button",
            children: languageData["CRM.Affiliation.delete"],
            closeAfterConfirm: true,
            onConfirm: () => {
              startTransition(() => {
                deleteAffiliationByPartyType({partyId, partyType, router, affiliationId: row.id || ""});
              });
            },
          }}
          description={languageData["CRM.Affiliation.delete.confirm"]}
          loading={isPending}
          title={languageData["CRM.Affiliation.delete"]}
          type="without-trigger">
          <Button className="" data-testid="delete-affiliation" disabled={isPending} type="button" variant="outline">
            <Trash2Icon className="mr-2 size-4" />
            {languageData["CRM.Affiliation.delete"]}
          </Button>
        </ConfirmDialog>
        <Button data-testid="update-affiliation" disabled={isPending}>
          {languageData["CRM.Affiliation.update"]}
        </Button>
      </div>
    </SchemaForm>
  );
}
