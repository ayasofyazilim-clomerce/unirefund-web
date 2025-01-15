import type { UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto } from "@ayasofyazilim/saas/CRMService";
import type {
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {
  FieldConfigType,
  ZodObjectOrWrapped,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { Eye, KeyIcon, PlusCircle, User2 } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { postSendPasswordResetCodeApi } from "src/actions/core/AccountService/post-actions";
import {
  handlePostResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import {
  putUsersByIdLockByLockoutEndApi,
  putUsersByIdUnlockApi,
} from "src/actions/core/IdentityService/put-actions";
import { postAbpUserAccountByIndividualIdApi } from "src/actions/unirefund/CrmService/post-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { AutoFormValues } from "./table";

type IndividualsTable =
  TanstackTableCreationProps<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>;

interface FormData {
  lockoutEnd?: string;
}

function individualsRowActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
): TanstackTableRowActionsType<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>[] {
  const actions: TanstackTableRowActionsType<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>[] =
    [];

  actions.push(
    {
      type: "confirmation-dialog",
      cta: languageData["Merchants.Individual.Create.User"],
      title: languageData["Merchants.Individual.Create.User"],
      actionLocation: "row",
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description: languageData["Merchants.Individual.Create.User.Description"],
      icon: User2,
      onConfirm: (row) => {
        void postAbpUserAccountByIndividualIdApi(row.partyId || "").then(
          (res) => {
            handlePostResponse(res, router);
          },
        );
      },
    },
    {
      type: "simple",
      cta: languageData["Merchants.Individual.SetPassword"],
      actionLocation: "row",
      icon: Eye,
      onClick: (row) => {
        router.push(`/management/identity/users/${row.abpUserId}/set-password`);
      },
    },
    {
      type: "confirmation-dialog",
      cta: languageData["Merchants.Individual.Send.Password.Code.Reset"],
      title: languageData["Merchants.Individual.Send.Password.Code.Reset"],
      actionLocation: "row",
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description:
        languageData[
          "Merchants.Individual.Send.Password.Code.Reset.Description"
        ],
      icon: Eye,
      onConfirm: (row) => {
        void postSendPasswordResetCodeApi({
          requestBody: {
            email: row.email || "",
            appName: "Angular",
          },
        }).then((res) => {
          handlePostResponse(res, router);
        });
      },
    },
    {
      type: "custom-dialog",
      cta: languageData["Merchants.Individual.Lock.User"],
      title: languageData["Merchants.Individual.Lock.User"],
      actionLocation: "row",
      icon: KeyIcon,
      content: (row) => {
        return (
          <SchemaForm
            onSubmit={(data) => {
              const formData = data.formData as FormData;
              void putUsersByIdLockByLockoutEndApi({
                id: row.abpUserId || "",
                lockoutEnd: formData.lockoutEnd || "",
              }).then((res) => {
                handlePutResponse(res, router);
              });
            }}
            schema={{
              type: "object",
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
    },
    {
      type: "confirmation-dialog",
      cta: languageData["Merchants.Individual.Unlock.User"],
      title: languageData["Merchants.Individual.Unlock.User"],
      actionLocation: "row",
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description: languageData["Merchants.Individual.Unlock.User.Description"],
      icon: KeyIcon,
      onConfirm: (row) => {
        void putUsersByIdUnlockApi(row.abpUserId || "").then((res) => {
          handlePostResponse(res, router);
        });
      },
    },
  );
  return actions;
}

export function individualsColumns(
  languageData: CRMServiceServiceResource,
  locale: string,
) {
  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>(
    {
      languageData,
      rows: $UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto.properties,
      config: {
        locale,
      },
    },
  );
}

function individualsTable(
  languageData: CRMServiceServiceResource,
  addAffilationsFormSchema: ZodObjectOrWrapped,
  handleSubmit: (formData: AutoFormValues) => void,
  fieldConfig: FieldConfigType,
  router: AppRouterInstance,
): IndividualsTable {
  const table: IndividualsTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: [
        "name",
        "codeName",
        "email",
        "telephone",
        "entityInformationTypeCode",
        "abpUserId",
      ],
    },
    columnOrder: [
      "name",
      "codeName",
      "email",
      "telephone",
      "entityInformationTypeCode",
      "abpUserId",
    ],
    filters: {
      textFilters: ["name", "email", "telephone"],
      facetedFilters: {
        entityInformationTypeCode: {
          options: [
            { label: "INDIVIDUAL", value: "INDIVIDUAL" },
            { label: "ORGANIZATION", value: "ORGANIZATION" },
          ],
          title: languageData["Parties.Type"],
        },
      },
    },
    tableActions: [
      {
        type: "autoform-dialog",
        actionLocation: "table",
        cta: languageData["Affiliations.New"],
        title: languageData["Affiliations.New"],
        schema: addAffilationsFormSchema,
        fieldConfig,
        icon: PlusCircle,
        onSubmit(values) {
          handleSubmit(values as AutoFormValues);
        },
        submitText: languageData.Save,
      },
    ],
    rowActions: individualsRowActions(languageData, router),
  };
  return table;
}
export const tableData = {
  individuals: {
    columns: individualsColumns,
    table: individualsTable,
  },
};
