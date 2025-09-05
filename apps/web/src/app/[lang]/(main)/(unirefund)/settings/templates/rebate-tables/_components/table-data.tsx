import {Badge} from "@/components/ui/badge";
import type {UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as RebateTableHeaderDto} from "@repo/saas/ContractService";
import {$UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as $RebateTableHeaderDto} from "@repo/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantListResponseDto as MerchantProfileDto} from "@repo/saas/CRMService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {CheckCircle, PlusCircle, XCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useTransition} from "react";
import Link from "next/link";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {postRebateTableHeaderCloneByIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import {getBaseLink} from "@/utils";

type RebateTableHeaders = TanstackTableCreationProps<RebateTableHeaderDto>;

const rebateTableHeadersColumns = (
  locale: string,
  merchants: MerchantProfileDto[],
  languageData: ContractServiceResource,
) =>
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
            label: languageData["Contracts.Assigned"],
            conditions: [
              {
                conditionAccessorKey: "isAssigned",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: languageData["Contracts.Template"],
            conditions: [
              {
                conditionAccessorKey: "isTemplate",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: languageData["Contracts.Customized"],
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
      merchantId: {
        content(row) {
          if (!row.merchantId) return <></>;
          const merchant = merchants.find((mc) => mc.id === row.merchantId);
          if (!merchant) return <></>;
          return (
            <Link href={getBaseLink(`parties/merchants/${row.merchantId}/details`, locale)}>
              <Badge className="block max-w-52 overflow-hidden text-ellipsis">{merchant.name}</Badge>
            </Link>
          );
        },
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
      columns: ["name", "merchantId", "creationTime", "lastModificationTime"],
    },
    columnOrder: ["name", "merchantId", "creationTime", "lastModificationTime"],
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
        cta: languageData["Contracts.Clone"],
        condition: (row) => {
          return isActionGranted(["ContractService.RebateTableHeader.Create"], grantedPolicies) && row.isTemplate;
        },
        content: (row) => <CloneForm languageData={languageData} merchants={merchants} router={router} row={row} />,
        title: (row) => (
          <div className="flex items-center gap-2">
            {languageData["Contracts.CloningFrom"]}
            <Badge>{row.name}</Badge>
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
      submitText={languageData["Contracts.Clone"]}
      uiSchema={{
        isTemplate: {
          "ui:title": languageData["Contracts.Form.isTemplate"],
          "ui:widget": "switch",
          "ui:className": "border px-2 rounded-md h-max self-end",
        },
        merchantId: {
          "ui:title": languageData["Contracts.Form.merchantId"],
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
