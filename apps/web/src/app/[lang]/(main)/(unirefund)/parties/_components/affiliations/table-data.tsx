"use client";
import {Button} from "@/components/ui/button";
import {Volo_Abp_Identity_IdentityRoleDto as RoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import {
  $UniRefund_CRMService_Affiliations_AffiliationListResponseDto as $AffiliationListResponseDto,
  $UniRefund_CRMService_Affiliations_UpdateAffiliationDto as $UpdateAffiliationDto,
  UniRefund_CRMService_Affiliations_AffiliationListResponseDto as AffiliationListResponseDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {deleteMerchantAffiliationByIdApi} from "@repo/actions/unirefund/CrmService/delete-actions";
import {putMerchantAffiliationByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import type {
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handleDeleteResponse, handlePutResponse} from "@repo/utils/api";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {PlusCircle, Trash2Icon} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useParams} from "next/navigation";
import {Dispatch, TransitionStartFunction, useTransition} from "react";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

type AffiliationTable = TanstackTableCreationProps<AffiliationListResponseDto>;

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
      onClick: () => setOpen(true),
    },
  ];

  return actions;
}

function affiliationColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
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

function affiliationTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  roles: RoleDto[],
  isRolesAvailable: boolean,
  isUsersAvailable: boolean,
  setOpen: Dispatch<React.SetStateAction<boolean>>,
) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const [isPending, startTransition] = useTransition();

  const table: AffiliationTable = {
    tableActions: affiliationTableActions(languageData, grantedPolicies, isUsersAvailable, isRolesAvailable, setOpen),
    filters: {
      textFilters: ["name"],
      facetedFilters: isRolesAvailable
        ? {
            roleName: {
              title: languageData["CRM.roleName"],
              options: roles.map((role) => ({
                label: role.name!,
                value: role.name!,
              })),
            },
          }
        : undefined,
    },
    expandedRowComponent: (row) =>
      EditForm({
        row,
        partyId,
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
    table: affiliationTable,
  },
};

function EditForm({
  row,
  partyId,
  languageData,
  roles,
  isPending,
  startTransition,
  router,
}: {
  row: AffiliationListResponseDto;
  partyId: string;
  languageData: CRMServiceServiceResource;
  roles: RoleDto[];
  isPending: boolean;
  startTransition: TransitionStartFunction;
  router: AppRouterInstance;
}) {
  return (
    <SchemaForm<AffiliationListResponseDto>
      key={JSON.stringify(row)}
      schema={$UpdateAffiliationDto}
      withScrollArea={false}
      useDefaultSubmit={false}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $UpdateAffiliationDto,
        name: "Form.Merchant.affiliation",
        extend: {
          "ui:className": "grid grid-cols-2 border-none rounded-none p-2",
          displayLabel: false,
          isPrimary: {
            "ui:widget": "switch",
            "ui:className": "border rounded-md px-2 self-end",
          },
          abpRoleId: {
            "ui:widget": "roleWidget",
          },
        },
      })}
      widgets={{
        roleWidget: CustomComboboxWidget<RoleDto>({
          languageData,

          list: roles,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
      disabled={isPending}
      filter={{type: "include", sort: true, keys: ["abpRoleId", "isPrimary", "startDate", "endDate"]}}
      formData={row}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putMerchantAffiliationByIdApi({
            affiliationId: row.id!,
            merchantId: partyId,
            requestBody: {
              abpRoleId: row.abpRoleId === formData.abpRoleId ? undefined : formData.abpRoleId,
              isPrimary: row.isPrimary === formData.isPrimary ? undefined : formData.isPrimary,
              startDate: row.startDate === formData.startDate ? undefined : formData.startDate,
              endDate: row.endDate === formData.endDate ? undefined : formData.endDate,
            },
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}>
      <div className="flex justify-end gap-2 bg-white px-2 pb-2">
        <ConfirmDialog
          title={languageData["Form.Merchant.affiliation.delete"]}
          description={languageData["Form.Merchant.affiliation.delete.confirm"]}
          loading={isPending}
          closeProps={{children: languageData["Cancel"]}}
          confirmProps={{
            type: "button",
            children: languageData["Form.Merchant.affiliation.delete"],
            closeAfterConfirm: true,
            onConfirm: () => {
              startTransition(() => {
                void deleteMerchantAffiliationByIdApi({merchantId: partyId, affiliationId: row.id!}).then((res) => {
                  handleDeleteResponse(res, router);
                });
              });
            },
          }}
          type="without-trigger">
          <Button type="button" variant="outline" className="">
            <Trash2Icon className="mr-2 size-4" />
            {languageData["Form.Merchant.affiliation.delete"]}
          </Button>
        </ConfirmDialog>
        <Button>{languageData["Form.Merchant.affiliation.update"]}</Button>
      </div>
    </SchemaForm>
  );
}
