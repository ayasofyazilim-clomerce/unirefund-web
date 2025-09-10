import type {UniRefund_FileService_FileTypes_FileTypeListDto} from "@repo/saas/FileService";
import {$UniRefund_FileService_FileTypes_FileTypeListDto} from "@repo/saas/FileService";
import {deleteFileTypesByIdApi} from "@repo/actions/unirefund/FileService/delete-actions";
import type {
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {
  BooleanOptions,
  tanstackTableCreateColumnsByRowData,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {handleDeleteResponse} from "@repo/utils/api";
import {isActionGranted, type Policy} from "@repo/utils/policies";
import {Edit, Trash} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {DefaultResource} from "@/language-data/core/Default";

type FileTypeTable = TanstackTableCreationProps<UniRefund_FileService_FileTypes_FileTypeListDto>;

function fileTypeTableActions(router: AppRouterInstance, languageData: DefaultResource, locale: string) {
  const actions: TanstackTableTableActionsType<UniRefund_FileService_FileTypes_FileTypeListDto>[] = [];
  actions.push({
    type: "simple",
    actionLocation: "table",
    cta: languageData.New,
    icon: Edit,
    onClick: () => {
      router.push(`/${locale}/management/file/file-types/new`);
    },
  });

  return actions;
}

function fileTypeRowActions(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  locale: string,
): TanstackTableRowActionsType<UniRefund_FileService_FileTypes_FileTypeListDto>[] {
  const actions: TanstackTableRowActionsType<UniRefund_FileService_FileTypes_FileTypeListDto>[] = [
    {
      type: "simple",
      actionLocation: "row",
      cta: languageData.Edit,
      icon: Edit,
      onClick: (row) => {
        router.push(`/${locale}/management/file/file-types/${row.id}`);
      },
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
      condition: () => isActionGranted(["FileService.FileType.Delete"], grantedPolicies),
      onConfirm: (row) => {
        void deleteFileTypesByIdApi(row.id).then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    },
  ];

  return actions;
}

function fileTypeColumns(locale: string) {
  return tanstackTableCreateColumnsByRowData<UniRefund_FileService_FileTypes_FileTypeListDto>({
    rows: $UniRefund_FileService_FileTypes_FileTypeListDto.properties,
    config: {
      locale,
    },
    faceted: {
      isPublic: BooleanOptions,
      dateRequired: BooleanOptions,
      isMulti: BooleanOptions,
      isTenant: BooleanOptions,
      originatorRequired: BooleanOptions,
      numberRequired: BooleanOptions,
    },
  });
}

function fileTypeTable(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  locale: string,
): FileTypeTable {
  const table: FileTypeTable = {
    fillerColumn: "namespace",
    columnVisibility: {
      type: "hide",
      columns: ["id", "providerID"],
    },
    columnOrder: ["name"],
    tableActions: fileTypeTableActions(router, languageData, locale),
    rowActions: fileTypeRowActions(languageData, router, grantedPolicies, locale),
  };
  return table;
}
export const tableData = {
  fileType: {
    columns: fileTypeColumns,
    table: fileTypeTable,
  },
};
