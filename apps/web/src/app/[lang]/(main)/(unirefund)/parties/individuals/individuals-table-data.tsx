"use client";
import {CheckCircle, Eye, LockIcon, PlusCircle, UnlockIcon, User2, XCircle} from "lucide-react";
import {$UniRefund_CRMService_Individuals_IndividualProfileDto} from "@ayasofyazilim/saas/CRMService";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {handlePostResponse, handlePutResponse} from "@repo/utils/api";
import {isActionGranted} from "@repo/utils/policies";
import type {UniRefund_CRMService_Individuals_IndividualProfileDto} from "@ayasofyazilim/saas/CRMService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import type {Policy} from "@repo/utils/policies";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {postAbpUserAccountByIndividualIdApi} from "@/actions/unirefund/CrmService/post-actions";
import {putUsersByIdLockByLockoutEndApi, putUsersByIdUnlockApi} from "@/actions/core/IdentityService/put-actions";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

const affiliationTypes = ["COFOUNDER", "PARTNER", "ABPUSER", "SUBCOMPANY", "ACCOUNTMANAGER", "Franchise"];

const entityPartyTypeCode = ["CUSTOMS", "MERCHANT", "REFUNDPOINT", "TAXFREE", "TAXOFFICE"];
type IndividualTable = TanstackTableCreationProps<UniRefund_CRMService_Individuals_IndividualProfileDto>;

interface FormData {
  lockoutEnd: string;
}

const links: Partial<Record<keyof UniRefund_CRMService_Individuals_IndividualProfileDto, TanstackTableColumnLink>> = {};
function individualsTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["CRMService.Individuals.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      onClick() {
        router.push("individuals/new");
      },
    });
  }
  return actions;
}
function individualsRowActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<UniRefund_CRMService_Individuals_IndividualProfileDto>[] = [];
  if (isActionGranted(["CRMService.Individuals.CreateAbpUserAccount"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData["Merchants.Individual.Create.User"],
      title: languageData["Merchants.Individual.Create.User"],
      actionLocation: "row",
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description: languageData["Merchants.Individual.Create.User.Description"],
      condition: (row) => row.abpUserId === null,
      icon: User2,
      onConfirm: (row) => {
        void postAbpUserAccountByIndividualIdApi(row.id || "").then((res) => {
          handlePostResponse(res, router);
        });
      },
    });
    if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
      actions.push({
        type: "custom-dialog",
        cta: languageData["Merchants.Individual.Lock.User"],
        title: languageData["Merchants.Individual.Lock.User"],
        actionLocation: "row",
        icon: LockIcon,
        condition: (row) => row.abpUserId !== null,
        content: (row) => {
          return (
            <SchemaForm<FormData>
              onSubmit={({formData}) => {
                if (!formData) return;
                void putUsersByIdLockByLockoutEndApi({
                  id: row.abpUserId || "",
                  lockoutEnd: formData.lockoutEnd,
                }).then((res) => {
                  handlePutResponse(res, router);
                });
              }}
              schema={{
                type: "object",
                required: ["lockoutEnd"],
                properties: {
                  lockoutEnd: {
                    type: "string",
                    format: "date-time",
                  },
                },
              }}
            />
          );
        },
      });
    }
    if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
      actions.push({
        type: "confirmation-dialog",
        cta: languageData["Merchants.Individual.Unlock.User"],
        title: languageData["Merchants.Individual.Unlock.User"],
        actionLocation: "row",
        confirmationText: languageData.Save,
        cancelText: languageData.Cancel,
        description: languageData["Merchants.Individual.Unlock.User.Description"],
        icon: UnlockIcon,
        condition: (row) => row.abpUserId !== null,
        onConfirm: (row) => {
          void putUsersByIdUnlockApi(row.abpUserId || "").then((res) => {
            handlePostResponse(res, router);
          });
        },
      });
    }
    if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
      actions.push({
        type: "simple",
        cta: languageData["Merchants.Individual.SetPassword"],
        actionLocation: "row",
        condition: (row) => row.abpUserId !== null,
        icon: Eye,
        onClick: (row) => {
          router.push(`/management/identity/users/${row.abpUserId}/set-password`);
        },
      });
    }
    // if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
    //   actions.push({
    //     type: "confirmation-dialog",
    //     cta: languageData["Merchants.Individual.Send.Password.Code.Reset"],
    //     title: languageData["Merchants.Individual.Send.Password.Code.Reset"],
    //     actionLocation: "row",
    //     confirmationText: languageData.Save,
    //     cancelText: languageData.Cancel,
    //     description: languageData["Merchants.Individual.Send.Password.Code.Reset.Description"],
    //     icon: Eye,
    //     condition: (row) => row.abpUserId !== null,
    //     onConfirm: (row) => {
    //       void postSendPasswordResetCodeApi({
    //         requestBody: {
    //           email: row.email || "",
    //           appName: "Angular",
    //         },
    //       }).then((res) => {
    //         handlePostResponse(res, router);
    //       });
    //     },
    //   });
    // }
  }
  return actions;
}
function individualColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted(["CRMService.Individuals.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "individuals",
      targetAccessorKey: "id",
      suffix: "details/name",
    };
  }

  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_Individuals_IndividualProfileDto>({
    rows: $UniRefund_CRMService_Individuals_IndividualProfileDto.properties,
    languageData: {
      name: languageData.Name,
      affiliationCode: languageData.Role,
      affiliationParentTypeCode: languageData["Parties.FormationType"],
    },
    faceted: {
      abpUserId: {
        options: [
          {
            label: "Yes",
            when: (value) => {
              return Boolean(value);
            },
            value: "true",
            icon: CheckCircle,
            iconClassName: "text-green-700",
            hideColumnValue: true,
          },
          {
            label: "No",
            when: (value) => {
              return !value;
            },
            value: "false",
            icon: XCircle,
            iconClassName: "text-red-700",
            hideColumnValue: true,
          },
        ],
      },
    },
    config: {
      locale,
    },
    links,
  });
}
function individualTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: IndividualTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "hide",
      columns: ["id", "affiliationId", "affiliationCode"],
    },
    columnOrder: ["name"],
    tableActions: individualsTableActions(languageData, router, grantedPolicies),
    rowActions: individualsRowActions(languageData, router, grantedPolicies),
    filters: {
      textFilters: ["name", "email", "telephone"],
      facetedFilters: {
        affiliationType: {
          title: "Type",
          options: affiliationTypes.map((x) => ({label: x, value: x})),
        },
        entityPartyTypeCode: {
          title: "Entity Type",
          options: entityPartyTypeCode.map((x) => ({label: x, value: x})),
        },
      },
    },
  };
  return table;
}

export const tableData = {
  individuals: {
    columns: individualColumns,
    table: individualTable,
  },
};
