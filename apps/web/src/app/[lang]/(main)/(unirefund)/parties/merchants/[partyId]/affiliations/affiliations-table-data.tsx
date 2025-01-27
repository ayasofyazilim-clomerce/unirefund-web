import type {
  UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto,
  UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto,
  UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
} from "@ayasofyazilim/saas/CRMService";
import {
  $UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto,
  $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
} from "@ayasofyazilim/saas/CRMService";
import type {
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { Eye, KeyIcon, Plus, User2 } from "lucide-react";
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
import {
  postAbpUserAccountByIndividualIdApi,
  postAffiliationsToMerchantApi,
} from "src/actions/unirefund/CrmService/post-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

type AffilationsTable =
  TanstackTableCreationProps<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>;

interface FormData {
  lockoutEnd: string;
}

function affilationsRowActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  partyId: string,
  affiliationCodes: UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[],
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
      condition: (row) => row.abpUserId === null,
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
      type: "custom-dialog",
      actionLocation: "row",
      cta: languageData["Affiliations.New"],
      title: languageData["Affiliations.New"],
      icon: Plus,
      content: (row) => (
        <SchemaForm<UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto>
          className="flex flex-col gap-4"
          filter={{
            type: "include",
            sort: true,
            keys: ["affiliationCodeId"],
          }}
          onSubmit={({ formData }) => {
            if (!formData) return;
            void postAffiliationsToMerchantApi({
              id: partyId,
              requestBody: {
                ...formData,
                entityInformationTypeCode: "INDIVIDUAL",
                email: row.email || "",
              },
            }).then((res) => {
              handlePostResponse(res, router);
            });
          }}
          schema={
            $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto
          }
          submitText={languageData.Save}
          uiSchema={createUiSchemaWithResource({
            schema:
              $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
            resources: languageData,
            name: "Form.Merchant.Affiliation",
            extend: {
              affiliationCodeId: {
                "ui:widget": "affilationCode",
              },
            },
          })}
          widgets={{
            affilationCode:
              CustomComboboxWidget<UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto>(
                {
                  languageData,
                  list: affiliationCodes,
                  selectIdentifier: "id",
                  selectLabel: "name",
                },
              ),
          }}
        />
      ),
    },
    {
      type: "simple",
      cta: languageData["Merchants.Individual.SetPassword"],
      actionLocation: "row",
      condition: (row) => row.abpUserId !== null,
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
      condition: (row) => row.abpUserId !== null,
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
      condition: (row) => row.abpUserId !== null,
      content: (row) => {
        return (
          <SchemaForm<FormData>
            onSubmit={({ formData }) => {
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
      condition: (row) => row.abpUserId !== null,
      onConfirm: (row) => {
        void putUsersByIdUnlockApi(row.abpUserId || "").then((res) => {
          handlePostResponse(res, router);
        });
      },
    },
  );
  return actions;
}

export function affilationsColumns(
  languageData: CRMServiceServiceResource,
  locale: string,
) {
  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>(
    {
      languageData: {
        languageData,
        constantKey: "Form.Merchant.Affiliation",
      },
      rows: $UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto.properties,
      config: {
        locale,
      },
    },
  );
}

function affilationsTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  partyId: string,
  affiliationCodes: UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[],
): AffilationsTable {
  const table: AffilationsTable = {
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
        type: "custom-dialog",
        actionLocation: "table",
        cta: languageData["Affiliations.New"],
        title: languageData["Affiliations.New"],
        icon: Plus,
        content: (
          <SchemaForm<UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto>
            className="flex flex-col gap-4"
            filter={{
              type: "include",
              sort: true,
              keys: ["email", "affiliationCodeId"],
            }}
            onSubmit={({ formData }) => {
              if (!formData) return;
              // void postAffiliationsToPartyApi(partyName, {
              //   id: partyId,
              //   requestBody: {
              //     ...formData,
              //     entityInformationTypeCode: "INDIVIDUAL",
              //   },
              // }).then((res) => {
              //   handlePostResponse(res, router);
              // });
            }}
            schema={
              $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto
            }
            submitText={languageData.Save}
            uiSchema={createUiSchemaWithResource({
              schema:
                $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
              resources: languageData,
              name: "Form.Merchant.Affiliation",
              extend: {
                affiliationCodeId: {
                  "ui:widget": "affilationCode",
                },
                email: {
                  "ui:widget": "email",
                },
              },
            })}
            widgets={{
              affilationCode:
                CustomComboboxWidget<UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto>(
                  {
                    languageData,
                    list: affiliationCodes,
                    selectIdentifier: "id",
                    selectLabel: "name",
                  },
                ),
            }}
          />
        ),
      },
    ],
    rowActions: affilationsRowActions(
      languageData,
      router,
      partyId,
      affiliationCodes,
    ),
  };
  return table;
}
export const tableData = {
  affilations: {
    columns: affilationsColumns,
    table: affilationsTable,
  },
};
