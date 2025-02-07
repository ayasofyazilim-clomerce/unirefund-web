import {Badge} from "@/components/ui/badge";
import type {UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderListDto as RefundTableHeaderDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderListDto as $RefundTableHeaderDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto as MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import type {
  TanstackTableCreationProps,
  TanstackTableLanguageDataType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import type {Policy} from "@repo/utils/policies";
import {PlusCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useTransition} from "react";
import isActionGranted from "@/utils/page-policy/action-policy";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {postRefundTableHeaderCloneByIdApi} from "@/actions/unirefund/ContractService/post-actions";

type RefundTableHeaders = TanstackTableCreationProps<RefundTableHeaderDto>;

const refundTableHeadersColumns = (locale: string, languageData?: TanstackTableLanguageDataType) =>
  tanstackTableCreateColumnsByRowData<RefundTableHeaderDto>({
    rows: $RefundTableHeaderDto.properties,
    languageData,
    config: {
      locale,
    },
    links: {
      name: {
        prefix: `refund-tables`,
        targetAccessorKey: "id",
      },
    },
    badges: {
      name: {
        values: [
          {
            position: "before",
            label: "Default",
            conditions: [
              {
                conditionAccessorKey: "isDefault",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: "Bundling",
            conditions: [
              {
                conditionAccessorKey: "isBundling",
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

const refundTableHeadersTable = (params: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
  router: AppRouterInstance;
  grantedPolicies: Record<Policy, boolean>;
}) => {
  const {languageData, merchants, router, grantedPolicies} = params;
  const table: RefundTableHeaders = {
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
          router.push(`refund-tables/new`);
        },
        cta: "Create",
        // condition: () => {
        //   return isActionGranted(
        //     ["ContractService.RefundTableHeader.Create", "ContractService.RefundTableHeader.CreateTemplate"],
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
          return isActionGranted(["ContractService.RefundTableHeader.Create"], grantedPolicies) && row.isTemplate;
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
  refundTableHeaders: {
    columns: refundTableHeadersColumns,
    table: refundTableHeadersTable,
  },
};

function CloneForm({
  row,
  merchants,
  languageData,
  router,
}: {
  row: RefundTableHeaderDto;
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
          void postRefundTableHeaderCloneByIdApi({
            id: row.id,
            ...formData,
          }).then((response) => {
            handlePostResponse(response, router, {
              identifier: "id",
              prefix: "refund-tables/",
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
