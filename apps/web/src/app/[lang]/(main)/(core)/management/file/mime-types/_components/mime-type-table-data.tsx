import {
  $UniRefund_FileService_MimeTypes_MimeTypeCreateDto,
  $UniRefund_FileService_MimeTypes_MimeTypeListDto,
  $UniRefund_FileService_MimeTypes_MimeTypeUpdateDto,
} from "@ayasofyazilim/saas/FileService";
import type {
  UniRefund_FileService_MimeTypes_MimeTypeCreateDto,
  UniRefund_FileService_MimeTypes_MimeTypeUpdateDto,
  UniRefund_FileService_MimeTypes_MimeTypeListDto,
} from "@ayasofyazilim/saas/FileService";
import {deleteMimeTypeByIdApi} from "@repo/actions/unirefund/FileService/delete-actions";
import {postMimeTypesApi} from "@repo/actions/unirefund/FileService/post-actions";
import {putMimeTypeApi} from "@repo/actions/unirefund/FileService/put-actions";
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

type MimeTypesTable = TanstackTableCreationProps<UniRefund_FileService_MimeTypes_MimeTypeListDto>;

function mimeTypesTableActions(router: AppRouterInstance) {
  const actions: TanstackTableTableActionsType<UniRefund_FileService_MimeTypes_MimeTypeListDto>[] = [];
  actions.push({
    type: "custom-dialog",
    actionLocation: "table",
    cta: "Yeni",
    title: "Yeni Ekle",
    icon: Plus,
    content: (
      <SchemaForm<UniRefund_FileService_MimeTypes_MimeTypeCreateDto>
        className="flex flex-col gap-4"
        onSubmit={({formData}) => {
          if (!formData) return;
          void postMimeTypesApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router);
          });
        }}
        schema={$UniRefund_FileService_MimeTypes_MimeTypeCreateDto}
        submitText="Kaydet"
      />
    ),
  });

  return actions;
}

function mimeTypesRowActions(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
): TanstackTableRowActionsType<UniRefund_FileService_MimeTypes_MimeTypeListDto>[] {
  const actions: TanstackTableRowActionsType<UniRefund_FileService_MimeTypes_MimeTypeListDto>[] = [
    {
      type: "custom-dialog",
      cta: languageData.Edit,
      title: languageData.Edit,
      actionLocation: "row",
      content: (row) => (
        <SchemaForm<UniRefund_FileService_MimeTypes_MimeTypeUpdateDto>
          className="flex flex-col gap-4"
          formData={row}
          onSubmit={({formData}) => {
            if (!formData) return;
            void putMimeTypeApi({
              id: row.id,
              requestBody: formData,
            }).then((res) => {
              handlePutResponse(res, router);
            });
          }}
          schema={$UniRefund_FileService_MimeTypes_MimeTypeUpdateDto}
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
        void deleteMimeTypeByIdApi(row.id).then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    },
  ];

  actions.push();

  return actions;
}

function mimeTypesColumns(locale: string) {
  return tanstackTableCreateColumnsByRowData<UniRefund_FileService_MimeTypes_MimeTypeListDto>({
    rows: $UniRefund_FileService_MimeTypes_MimeTypeListDto.properties,
    config: {
      locale,
    },
  });
}

function mimeTypesTable(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
): MimeTypesTable {
  const table: MimeTypesTable = {
    fillerColumn: "mimeTypeCode",
    columnVisibility: {
      type: "hide",
      columns: ["id"],
    },

    tableActions: mimeTypesTableActions(router),
    rowActions: mimeTypesRowActions(languageData, router, grantedPolicies),
  };
  return table;
}
export const tableData = {
  mimeTypes: {
    columns: mimeTypesColumns,
    table: mimeTypesTable,
  },
};
