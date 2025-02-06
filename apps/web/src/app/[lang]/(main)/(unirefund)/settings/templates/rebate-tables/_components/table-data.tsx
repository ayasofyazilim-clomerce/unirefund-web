import {Badge} from "@/components/ui/badge";
import type {UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as RebateTableHeaderDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as $RebateTableHeaderDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto as MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import type {Policy} from "@repo/utils/policies";
import {CheckCircle, PlusCircle, XCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useTransition} from "react";
import isActionGranted from "@/utils/page-policy/action-policy";
import {postRebateTableHeaderCloneByIdApi} from "@/actions/unirefund/ContractService/post-actions";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";

type RebateTableHeaders = TanstackTableCreationProps<RebateTableHeaderDto>;

const rebateTableHeadersColumns = (locale: string, languageData: ContractServiceResource) =>
  tanstackTableCreateColumnsByRowData<RebateTableHeaderDto>({
    rows: $RebateTableHeaderDto.properties,
    languageData: {
      constantKey: "Rebate.Form",
      languageData,
    },
    config: {
      locale,
    },
    links: {
      name: {
        prefix: `/settings/templates/rebate-tables`,
        targetAccessorKey: "id",
      },
    },
    faceted: {
      calculateNetCommissionInsteadOfRefund: {
        options: [
          {
            when: (val) => val === true,
            label: "",
            value: "",
            icon: CheckCircle,
            iconClassName: "text-green-700",
          },
          {
            when: (val) => val === false,
            label: "",
            value: "",
            icon: XCircle,
            iconClassName: "text-red-700",
          },
        ],
      },
    },
    badges: {
      name: {
        values: [
          {
            position: "before",
            label: "Assigned",
            conditions: [
              {
                conditionAccessorKey: "isAssigned",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: "Template",
            conditions: [
              {
                conditionAccessorKey: "isTemplate",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: "Customized",
            conditions: [
              {
                conditionAccessorKey: "isCustomizedOverTemplate",
                when: (value) => value === true,
              },
            ],
          },
        ],
      },
    },
  });

const rebateTableHeadersTable = (params: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
  router: AppRouterInstance;
  grantedPolicies: Record<Policy, boolean>;
}) => {
  const {languageData, merchants, router, grantedPolicies} = params;
  const table: RebateTableHeaders = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "creationTime", "lastModificationTime"],
    },
    columnOrder: ["name", "creationTime", "lastModificationTime"],
    tableActions: [
      {
        actionLocation: "table",
        type: "simple",
        icon: PlusCircle,
        onClick: () => {
          router.push(`rebate-tables/new`);
        },
        cta: "Create",
        // condition: () => {
        //   return isActionGranted(
        //     ["ContractService.RebateTableHeader.Create", "ContractService.RebateTableHeader.CreateTemplate"],
        //     grantedPolicies,
        //   );
        // },
      },
    ],
    rowActions: [
      {
        actionLocation: "row",
        type: "custom-dialog",
        cta: "Clone",
        condition: (row) => {
          return (
            isActionGranted(["ContractService.RebateTableHeader.CreateFromTemplate"], grantedPolicies) && row.isTemplate
          );
        },
        content: (row) => <CloneForm languageData={languageData} merchants={merchants} router={router} row={row} />,
        title: (row) => (
          <div className="flex items-center gap-2">
            Cloning from<Badge>{row.name}</Badge>
          </div>
        ),
      },
    ],
  };
  return table;
};

export const tableData = {
  rebateTableHeaders: {
    columns: rebateTableHeadersColumns,
    table: rebateTableHeadersTable,
  },
};

function CloneForm({
  row,
  merchants,
  languageData,
  router,
}: {
  row: RebateTableHeaderDto;
  merchants: MerchantProfileDto[];
  languageData: ContractServiceResource;
  router: AppRouterInstance;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <SchemaForm
      disabled={isPending}
      formData={{isTemplate: false}}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void postRebateTableHeaderCloneByIdApi({
            id: row.id,
            ...formData,
          }).then((response) => {
            handlePostResponse(response, router, {
              identifier: "id",
              prefix: "rebate-tables/",
            });
          });
        });
      }}
      schema={{
        type: "object",
        properties: {
          isTemplate: {type: "boolean"},
          merchantId: {type: "string", format: "uuid"},
        },
      }}
      uiSchema={{
        isTemplate: {"ui:widget": "switch", "ui:className": "border px-2 rounded-md h-max self-end"},
        merchantId: {
          "ui:widget": "Merchants",
          dependencies: [
            {
              target: "isTemplate",
              when: (targetValue: boolean) => targetValue,
              type: DependencyType.HIDES,
            },
            {
              target: "isTemplate",
              when: (targetValue: boolean) => !targetValue,
              type: DependencyType.REQUIRES,
            },
          ],
        },
      }}
      useDependency
      widgets={{
        Merchants: CustomComboboxWidget<MerchantProfileDto>({
          languageData,
          list: merchants,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
    />
  );
}
