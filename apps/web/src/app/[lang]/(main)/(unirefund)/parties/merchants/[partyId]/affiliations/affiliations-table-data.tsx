import type {
  UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto,
  UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto,
  UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
} from "@ayasofyazilim/saas/CRMService";
import {CheckCircle, Eye, FileText, LockIcon, Plus, Trash, UnlockIcon, User2, XCircle} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
  $UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto,
  $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
} from "@ayasofyazilim/saas/CRMService";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {handleDeleteResponse, handlePostResponse, handlePutResponse} from "@repo/utils/api";
import {isActionGranted} from "@repo/utils/policies";
import type {
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {Policy} from "@repo/utils/policies";
import {getBaseLink} from "@/utils";
import {deleteMerchantsByIdAffiliationsByAffiliationIdApi} from "@/actions/unirefund/CrmService/delete-actions";
import {
  postAbpUserAccountByIndividualIdApi,
  postAffiliationsToMerchantApi,
} from "src/actions/unirefund/CrmService/post-actions";
import {putUsersByIdLockByLockoutEndApi, putUsersByIdUnlockApi} from "src/actions/core/IdentityService/put-actions";
import {postSendPasswordResetCodeApi} from "src/actions/core/AccountService/post-actions";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

type AffiliationsTable = TanstackTableCreationProps<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>;

interface FormData {
  lockoutEnd: string;
}

function affiliationsTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  partyId: string,
  affiliationCodes: UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[],
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["CRMService.Merchants.CreateAffiliation"], grantedPolicies)) {
    actions.push({
      type: "custom-dialog",
      actionLocation: "table",
      cta: languageData["Affiliations.New"],
      title: languageData["Affiliations.New"],
      icon: Plus,
      content: (
        <FormReadyComponent
          active={affiliationCodes.length === 0}
          content={{
            icon: <FileText className="size-20 text-gray-400" />,
            title: languageData["Missing.Affiliation.Title"],
            message: languageData["Missing.Affiliation.Message"],
            action: (
              <Button asChild className="text-blue-500" variant="link">
                <Link href={getBaseLink("settings/affiliations/merchants")}>{languageData.New}</Link>
              </Button>
            ),
          }}>
          <SchemaForm<UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto>
            className="flex flex-col gap-4"
            filter={{
              type: "include",
              sort: true,
              keys: ["email", "affiliationCodeId"],
            }}
            onSubmit={({formData}) => {
              if (!formData) return;
              void postAffiliationsToMerchantApi({
                id: partyId,
                requestBody: {
                  ...formData,
                  entityInformationTypeCode: "INDIVIDUAL",
                },
              }).then((res) => {
                handlePostResponse(res, router);
              });
            }}
            schema={$UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto}
            submitText={languageData.Save}
            uiSchema={createUiSchemaWithResource({
              schema: $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
              resources: languageData,
              name: "Form.Parties.Affiliation",
              extend: {
                affiliationCodeId: {
                  "ui:widget": "affiliationCode",
                },
                email: {
                  "ui:widget": "email",
                },
              },
            })}
            widgets={{
              affiliationCode: CustomComboboxWidget<UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto>({
                languageData,
                list: affiliationCodes,
                selectIdentifier: "id",
                selectLabel: "name",
              }),
            }}
          />
        </FormReadyComponent>
      ),
    });
  }
  actions.push({
    type: "simple",
    actionLocation: "table",
    cta: languageData["Individuals.New"],
    icon: Plus,
    onClick() {
      router.push(getBaseLink(`parties/individuals/new?entityPartyTypeCode=MERCHANT&partyId=${partyId}`));
    },
  });
  return actions;
}

function affiliationsRowActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  partyId: string,
  affiliationCodes: UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[],
  grantedPolicies: Record<Policy, boolean>,
): TanstackTableRowActionsType<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>[] {
  const actions: TanstackTableRowActionsType<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>[] = [];
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
        void postAbpUserAccountByIndividualIdApi(row.partyId || "").then((res) => {
          handlePostResponse(res, router);
        });
      },
    });
  }
  if (isActionGranted(["CRMService.Merchants.CreateAffiliation"], grantedPolicies)) {
    actions.push({
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
          onSubmit={({formData}) => {
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
          schema={$UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto}
          submitText={languageData.Save}
          uiSchema={createUiSchemaWithResource({
            schema: $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
            resources: languageData,
            name: "Form.Parties.Affiliation",
            extend: {
              affiliationCodeId: {
                "ui:widget": "affiliationCode",
              },
            },
          })}
          widgets={{
            affiliationCode: CustomComboboxWidget<UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto>({
              languageData,
              list: affiliationCodes,
              selectIdentifier: "id",
              selectLabel: "name",
            }),
          }}
        />
      ),
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
  if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData["Merchants.Individual.Send.Password.Code.Reset"],
      title: languageData["Merchants.Individual.Send.Password.Code.Reset"],
      actionLocation: "row",
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description: languageData["Merchants.Individual.Send.Password.Code.Reset.Description"],
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
    });
  }
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
  if (isActionGranted(["CRMService.Merchants.DeleteAffiliation"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData.Delete,
      title: languageData.Delete,
      actionLocation: "row",
      confirmationText: languageData.Delete,
      cancelText: languageData.Cancel,
      description: languageData["Delete.Assurance"],
      icon: Trash,
      onConfirm: (row) => {
        void deleteMerchantsByIdAffiliationsByAffiliationIdApi({
          id: partyId,
          affiliationId: row.id || "",
        }).then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    });
  }

  return actions;
}

function affiliationsColumns(languageData: CRMServiceServiceResource, locale: string) {
  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto>({
    languageData: {
      languageData,
      constantKey: "Form.Parties.Affiliation",
    },
    rows: $UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto.properties,
    config: {
      locale,
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
  });
}

function affiliationsTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  partyId: string,
  affiliationCodes: UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[],
  grantedPolicies: Record<Policy, boolean>,
): AffiliationsTable {
  const table: AffiliationsTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "codeName", "email", "telephone", "entityInformationTypeCode", "abpUserId"],
    },
    columnOrder: ["name", "codeName", "email", "telephone", "entityInformationTypeCode", "abpUserId"],
    filters: {
      textFilters: ["name", "email", "telephone"],
      facetedFilters: {
        entityInformationTypeCode: {
          options: [
            {label: "INDIVIDUAL", value: "INDIVIDUAL"},
            {label: "ORGANIZATION", value: "ORGANIZATION"},
          ],
          title: languageData["Parties.Type"],
        },
      },
    },
    tableActions: affiliationsTableActions(languageData, router, partyId, affiliationCodes, grantedPolicies),
    rowActions: affiliationsRowActions(languageData, router, partyId, affiliationCodes, grantedPolicies),
  };
  return table;
}
export const tableData = {
  affiliations: {
    columns: affiliationsColumns,
    table: affiliationsTable,
  },
};
