"use client";
import {Button} from "@/components/ui/button";
import type {Volo_Abp_Identity_IdentityRoleDto as RoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import type {UniRefund_CRMService_Affiliations_AffiliationListResponseDto as AffiliationListResponseDto} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_Affiliations_AffiliationListResponseDto as $AffiliationListResponseDto,
  $UniRefund_CRMService_Affiliations_UpdateAffiliationDto as $UpdateAffiliationDto,
} from "@repo/saas/CRMService";
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
import type {Dispatch, SetStateAction} from "react";
import {useState} from "react";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

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

function affiliationColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  // router: AppRouterInstance,
  // grantedPolicies: Record<Policy, boolean>,
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

function AffiliationTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  roles: RoleDto[],
  isRolesAvailable: boolean,
  isUsersAvailable: boolean,
  setOpen: Dispatch<React.SetStateAction<boolean>>,
) {
  const {partyId} = useParams<{lang: string; partyId: string}>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        languageData,
        roles,
        isSubmitting,
        setIsSubmitting,
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
  languageData,
  roles,
  isSubmitting,
  setIsSubmitting,
  router,
}: {
  row: AffiliationListResponseDto;
  partyId: string;
  languageData: CRMServiceServiceResource;
  roles: RoleDto[];
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  router: AppRouterInstance;
}) {
  return (
    <SchemaForm<AffiliationListResponseDto>
      disabled={isSubmitting}
      filter={{type: "include", sort: true, keys: ["abpRoleId", "isPrimary", "startDate", "endDate"]}}
      formData={row}
      key={JSON.stringify(row)}
      onSubmit={({formData}) => {
        if (!formData) return;
        setIsSubmitting(true);
        void putMerchantAffiliationByIdApi({
          affiliationId: row.id || "",
          merchantId: partyId,
          requestBody: {
            abpRoleId: row.abpRoleId === formData.abpRoleId ? undefined : formData.abpRoleId,
            isPrimary: row.isPrimary === formData.isPrimary ? undefined : formData.isPrimary,
            startDate: row.startDate === formData.startDate ? undefined : formData.startDate,
            endDate: row.endDate === formData.endDate ? undefined : formData.endDate,
          },
        }).then((res) => {
          handlePutResponse(res, router);
          setIsSubmitting(false);
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
          isPrimary: {
            "ui:widget": "switch",
            "ui:className": "border rounded-md px-2 self-end",
          },
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
            children: languageData["Form.Merchant.affiliation.delete"],
            closeAfterConfirm: true,
            onConfirm: () => {
              setIsSubmitting(true);
              void deleteMerchantAffiliationByIdApi({merchantId: partyId, affiliationId: row.id || ""}).then((res) => {
                handleDeleteResponse(res, router);
                setIsSubmitting(false);
              });
            },
          }}
          description={languageData["Form.Merchant.affiliation.delete.confirm"]}
          loading={isSubmitting}
          title={languageData["Form.Merchant.affiliation.delete"]}
          type="without-trigger">
          <Button className="" data-testid="delete-affiliation" disabled={isSubmitting} type="button" variant="outline">
            <Trash2Icon className="mr-2 size-4" />
            {languageData["Form.Merchant.affiliation.delete"]}
          </Button>
        </ConfirmDialog>
        <Button data-testid="update-affiliation" disabled={isSubmitting}>
          {languageData["Form.Merchant.affiliation.update"]}
        </Button>
      </div>
    </SchemaForm>
  );
}
