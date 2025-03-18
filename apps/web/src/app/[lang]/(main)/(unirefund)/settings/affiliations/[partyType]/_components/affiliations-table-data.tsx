import {Button} from "@/components/ui/button";
import type {UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto as AffiliationCodeDto} from "@ayasofyazilim/saas/CRMService";
import {
  $UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto as $AffiliationCodeDto,
  $UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto,
} from "@ayasofyazilim/saas/CRMService";
import type {
  GetApiIdentityRolesAssignableRolesByCurrentUserResponse,
  UniRefund_IdentityService_AssignableRoles_AssignableRoleDto,
} from "@ayasofyazilim/saas/IdentityService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {FileText, Plus} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import {handlePostResponse} from "@repo/utils/api";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import type {PartyNameType} from "@repo/actions/unirefund/CrmService/types";
import {postAffiliationCodesApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {entityPartyTypeCodeMap} from "./utils";

type IndividualsTable = TanstackTableCreationProps<AffiliationCodeDto>;
const links: Partial<Record<keyof AffiliationCodeDto, TanstackTableColumnLink>> = {};

function affiliationsTableActions(
  languageData: CRMServiceServiceResource,
  assignableRoles: GetApiIdentityRolesAssignableRolesByCurrentUserResponse,
  grantedPolicies: Record<Policy, boolean>,
  router: AppRouterInstance,
  partyType: Exclude<PartyNameType, "individuals">,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["CRMService.AffiliationCodes.Create"], grantedPolicies)) {
    actions.push({
      type: "custom-dialog",
      actionLocation: "table",
      cta: languageData["Affiliations.New"],
      title: languageData["Affiliations.New"],
      icon: Plus,
      content: (
        <FormReadyComponent
          active={assignableRoles.length === 0}
          content={{
            icon: <FileText className="size-20 text-gray-400" />,
            title: languageData["Missing.Affiliation.Title"],
            message: languageData["Missing.Affiliation.Message"],
            action: (
              <Button asChild className="text-blue-500" variant="link">
                <Link href={getBaseLink("settings/affiliations/customs")}>{languageData.New}</Link>
              </Button>
            ),
          }}>
          <SchemaForm<AffiliationCodeDto>
            className="flex flex-col gap-4"
            filter={{
              type: "exclude",
              sort: true,
              keys: ["status", "entityPartyTypeCode"],
            }}
            onSubmit={({formData}) => {
              if (!formData) return;
              void postAffiliationCodesApi({
                requestBody: {
                  ...formData,
                  status: "Approved",
                  entityPartyTypeCode: entityPartyTypeCodeMap[partyType],
                },
              }).then((res) => {
                handlePostResponse(res, router, {
                  prefix: `./${partyType}`,
                  identifier: "id",
                  suffix: "",
                });
              });
            }}
            schema={$UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto}
            uiSchema={createUiSchemaWithResource({
              schema: $UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto,
              resources: languageData,
              name: "Form.Affiliation",
              extend: {
                roleId: {
                  "ui:widget": "Role",
                },
              },
            })}
            widgets={{
              Role: CustomComboboxWidget<UniRefund_IdentityService_AssignableRoles_AssignableRoleDto>({
                languageData,
                list: assignableRoles,
                disabledItems: assignableRoles.filter((role) => !role.isAssignable).map((role) => role.roleId),
                selectIdentifier: "roleId",
                selectLabel: "roleName",
              }),
            }}
          />
        </FormReadyComponent>
      ),
    });
  }
  return actions;
}

function affiliationsColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
  partyType: Exclude<PartyNameType, "individuals">,
) {
  if (isActionGranted(["CRMService.AffiliationCodes.Edit"], grantedPolicies)) {
    links.name = {
      prefix: partyType,
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<AffiliationCodeDto>({
    languageData: {
      languageData,
      constantKey: "Form.Affiliation",
    },
    rows: $AffiliationCodeDto.properties,
    config: {
      locale,
    },
    links,
  });
}

function affiliationsTable(
  languageData: CRMServiceServiceResource,
  assignableRoles: GetApiIdentityRolesAssignableRolesByCurrentUserResponse,
  grantedPolicies: Record<Policy, boolean>,
  router: AppRouterInstance,
  partyType: Exclude<PartyNameType, "individuals">,
): IndividualsTable {
  const table: IndividualsTable = {
    fillerColumn: "name",
    columnOrder: ["name", "description"],
    columnVisibility: {
      type: "show",
      columns: ["name", "description", "creationTime"],
    },
    tableActions: affiliationsTableActions(languageData, assignableRoles, grantedPolicies, router, partyType),
  };
  return table;
}
export const tableData = {
  affiliations: {
    columns: affiliationsColumns,
    table: affiliationsTable,
  },
};
