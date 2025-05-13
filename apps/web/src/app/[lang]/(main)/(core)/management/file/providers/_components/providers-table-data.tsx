import {
  $UniRefund_FileService_Providers_ProviderDto,
  $UniRefund_FileService_Providers_ProviderListDto,
} from "@ayasofyazilim/saas/FileService";
import type {
  UniRefund_FileService_Providers_ProviderDto,
  type UniRefund_FileService_Providers_ProviderListDto,
} from "@ayasofyazilim/saas/FileService";
import {deleteProviderByIdApi} from "@repo/actions/unirefund/FileService/delete-actions";
import {postProviderApi} from "@repo/actions/unirefund/FileService/post-actions";
import {putProviderApi} from "@repo/actions/unirefund/FileService/put-actions";
import type {
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {handleDeleteResponse, handlePostResponse, handlePutResponse} from "@repo/utils/api";
import {isActionGranted, type Policy} from "@repo/utils/policies";
import {Edit, Plus, Trash} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {DefaultResource} from "@/language-data/core/Default";

type ProvidersTable = TanstackTableCreationProps<UniRefund_FileService_Providers_ProviderListDto>;

function providersTableActions(router: AppRouterInstance) {
  const actions: TanstackTableTableActionsType[] = [];
  actions.push({
    type: "custom-dialog",
    actionLocation: "table",
    cta: "Yeni",
    title: "Yeni Ekle",
    icon: Plus,
    content: (
      <SchemaForm<UniRefund_FileService_Providers_ProviderDto>
        className="flex flex-col gap-4"
        onSubmit={({formData}) => {
          if (!formData) return;
          void postProviderApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router);
          });
        }}
        schema={$UniRefund_FileService_Providers_ProviderDto}
        submitText="Kaydet"
      />
    ),
  });

  return actions;
}

function providersRowActions(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
): TanstackTableRowActionsType<UniRefund_FileService_Providers_ProviderListDto>[] {
  const actions: TanstackTableRowActionsType<UniRefund_FileService_Providers_ProviderListDto>[] = [
    {
      type: "custom-dialog",
      cta: languageData.Edit,
      title: languageData.Edit,
      actionLocation: "row",
      content: (row) => (
        <SchemaForm<UniRefund_FileService_Providers_ProviderDto>
          className="flex flex-col gap-4"
          formData={row}
          onSubmit={({formData}) => {
            if (!formData) return;
            void putProviderApi({
              id: row.id,
              requestBody: formData,
            }).then((res) => {
              handlePutResponse(res, router);
            });
          }}
          schema={$UniRefund_FileService_Providers_ProviderDto}
          submitText={languageData.Save}
        />
      ),
      icon: Edit,
      condition: () => isActionGranted(["FileService.MimeType.Update"], grantedPolicies),
    },

    {
      type: "confirmation-dialog",
      cta: languageData.Delete,
      title: languageData.Delete,
      actionLocation: "row",
      confirmationText: languageData.Delete,
      cancelText: languageData.Cancel,
      description: languageData["Delete.Assurance"],
      icon: Trash,
      condition: () => isActionGranted(["FileService.MimeType.Delete"], grantedPolicies),
      onConfirm: (row) => {
        void deleteProviderByIdApi(row.id).then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    },
  ];

  actions.push();

  return actions;
}

function providersColumns(locale: string) {
  return tanstackTableCreateColumnsByRowData<UniRefund_FileService_Providers_ProviderListDto>({
    rows: $UniRefund_FileService_Providers_ProviderListDto.properties,
    config: {
      locale,
    },
  });
}

function providersTable(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
): ProvidersTable {
  const table: ProvidersTable = {
    fillerColumn: "type",
    columnVisibility: {
      type: "hide",
      columns: ["id"],
    },

    tableActions: providersTableActions(router),
    rowActions: providersRowActions(languageData, router, grantedPolicies),
  };
  return table;
}
export const tableData = {
  providers: {
    columns: providersColumns,
    table: providersTable,
  },
};
