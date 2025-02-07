import {Badge} from "@/components/ui/badge";
import type {UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_CRMService_RefundPoints_RefundPointProfileDto as RefundPointProfileDto} from "@ayasofyazilim/saas/CRMService";
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
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useTransition} from "react";
import Link from "next/link";
import isActionGranted from "@/utils/page-policy/action-policy";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {postRefundFeeHeaderCloneByIdApi} from "@/actions/unirefund/ContractService/post-actions";
import {getBaseLink} from "@/utils";

type RefundFeeHeaders =
  TanstackTableCreationProps<UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto>;

const refundFeeHeadersColumns = (
  locale: string,
  refundPoints: RefundPointProfileDto[],
  languageData?: TanstackTableLanguageDataType,
) =>
  tanstackTableCreateColumnsByRowData<UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto>({
    rows: $UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto.properties,
    languageData,
    config: {
      locale,
    },
    links: {
      name: {
        prefix: `refund-fees`,
        targetAccessorKey: "id",
      },
    },
    badges: {
      name: {
        values: [
          {
            position: "before",
            label: "Active",
            conditions: [
              {
                conditionAccessorKey: "isActive",
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
    custom: {
      refundPointId: {
        content(row) {
          if (!row.refundPointId) return <></>;
          const refundPoint = refundPoints.find((rp) => rp.id === row.refundPointId);
          if (!refundPoint) return <></>;
          return (
            <Link href={getBaseLink(`parties/refund-points/${row.refundPointId}/details/info`, locale)}>
              <Badge className="block max-w-52 overflow-hidden text-ellipsis">{refundPoint.name}</Badge>
            </Link>
          );
        },
      },
    },
  });

const refundFeeHeadersTable = (params: {
  languageData: ContractServiceResource;
  refundPoints: RefundPointProfileDto[];
  router: AppRouterInstance;
  grantedPolicies: Record<Policy, boolean>;
}) => {
  const {languageData, refundPoints, router, grantedPolicies} = params;

  const table: RefundFeeHeaders = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "refundPointId", "creationTime", "lastModificationTime"],
    },
    columnOrder: ["name", "refundPointId", "creationTime", "lastModificationTime"],
    tableActions: [
      {
        type: "simple",
        cta: "New",
        actionLocation: "table",
        onClick: () => {
          router.push("refund-fees/new");
        },
        // condition: () => {
        //   return isActionGranted(
        //     ["ContractService.RefundFeeHeader.Create"],
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
          return isActionGranted(["ContractService.RefundFeeHeader.Create"], grantedPolicies) && row.isTemplate;
        },
        content: (row) => (
          <CloneForm languageData={languageData} refundPoints={refundPoints} router={router} row={row} />
        ),
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
  refundFeeHeaders: {
    columns: refundFeeHeadersColumns,
    table: refundFeeHeadersTable,
  },
};

function CloneForm({
  row,
  refundPoints,
  languageData,
  router,
}: {
  row: UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto;
  refundPoints: RefundPointProfileDto[];
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
          void postRefundFeeHeaderCloneByIdApi({
            id: row.id,
            ...formData,
          }).then((response) => {
            handlePostResponse(response, router, {
              identifier: "id",
              prefix: "refund-fees/",
            });
          });
        });
      }}
      schema={{
        type: "object",
        properties: {
          isTemplate: {type: "boolean"},
          refundPointId: {type: "string", format: "uuid"},
        },
      }}
      uiSchema={{
        isTemplate: {"ui:widget": "switch", "ui:className": "border px-2 rounded-md h-max self-end"},
        refundPointId: {
          "ui:widget": "RefundPoints",
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
        RefundPoints: CustomComboboxWidget<RefundPointProfileDto>({
          languageData,
          list: refundPoints,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
    />
  );
}
