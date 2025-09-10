import {
  $UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto,
  $UniRefund_FileService_FileTypeGroups_FileTypeGroupUpdateDto,
  type UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto,
  type UniRefund_FileService_FileTypeGroups_FileTypeGroupUpdateDto,
  type UniRefund_FileService_FileTypeGroups_FileTypeGroupDto,
  $UniRefund_FileService_FileTypeGroups_FileTypeGroupDto,
} from "@repo/saas/FileService";
import { deleteFileTypeGroupsByIdApi } from "@repo/actions/unirefund/FileService/delete-actions";
import { postFileTypeGroupsApi } from "@repo/actions/unirefund/FileService/post-actions";
import { putFileTypeGroupsByIdApi } from "@repo/actions/unirefund/FileService/put-actions";
import type {
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { handleDeleteResponse, handlePostResponse, handlePutResponse } from "@repo/utils/api";
import { isActionGranted, type Policy } from "@repo/utils/policies";
import { Edit, Plus, Trash } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { DefaultResource } from "@/language-data/core/Default";

type FileTypeGroupTable = TanstackTableCreationProps<UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto>;

function fileTypeGroupTableActions(router: AppRouterInstance) {
  const actions: TanstackTableTableActionsType<UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto>[] = [];
  actions.push({
    type: "custom-dialog",
    actionLocation: "table",
    cta: "Yeni",
    title: "Yeni Ekle",
    icon: Plus,
    content: (
      <SchemaForm<UniRefund_FileService_FileTypeGroups_FileTypeGroupDto>
        className="flex flex-col gap-4"
        onSubmit={({ formData }) => {
          if (!formData) return;
          void postFileTypeGroupsApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router);
          });
        }}
        schema={$UniRefund_FileService_FileTypeGroups_FileTypeGroupDto}
        submitText="Kaydet"
      />
    ),
  });

  return actions;
}

function fileTypeGroupRowActions(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
): TanstackTableRowActionsType<UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto>[] {
  const actions: TanstackTableRowActionsType<UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto>[] = [
    {
      type: "custom-dialog",
      cta: languageData.Edit,
      title: languageData.Edit,
      actionLocation: "row",
      content: (row) => (
        <SchemaForm<UniRefund_FileService_FileTypeGroups_FileTypeGroupUpdateDto>
          className="flex flex-col gap-4"
          formData={row}
          onSubmit={({ formData }) => {
            if (!formData) return;
            void putFileTypeGroupsByIdApi({
              id: row.id,
              requestBody: formData,
            }).then((res) => {
              handlePutResponse(res, router);
            });
          }}
          schema={$UniRefund_FileService_FileTypeGroups_FileTypeGroupUpdateDto}
          submitText={languageData.Save}
        />
      ),
      icon: Edit,
      condition: () => isActionGranted(["FileService.FileTypeGroup.Update"], grantedPolicies),
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
      condition: () => isActionGranted(["FileService.FileTypeGroup.Delete"], grantedPolicies),
      onConfirm: (row) => {
        void deleteFileTypeGroupsByIdApi(row.id).then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    },
  ];

  actions.push();

  return actions;
}

function fileTypeGroupColumns(locale: string) {
  return tanstackTableCreateColumnsByRowData<UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto>({
    rows: $UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto.properties,
    config: {
      locale,
    },
  });
}

function fileTypeGroupTable(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
): FileTypeGroupTable {
  const table: FileTypeGroupTable = {
    fillerColumn: "namespace",
    columnVisibility: {
      type: "hide",
      columns: ["id"],
    },

    tableActions: fileTypeGroupTableActions(router),
    rowActions: fileTypeGroupRowActions(languageData, router, grantedPolicies),
  };
  return table;
}
export const tableData = {
  fileTypeGroup: {
    columns: fileTypeGroupColumns,
    table: fileTypeGroupTable,
  },
};
