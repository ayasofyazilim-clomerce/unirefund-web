import {
  $UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto,
  type UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto,
} from "@ayasofyazilim/saas/FileService";
import {deleteFileRelationEntitiesByIdApi} from "@repo/actions/unirefund/FileService/delete-actions";
import type {
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {handleDeleteResponse} from "@repo/utils/api";
import {isActionGranted, type Policy} from "@repo/utils/policies";
import {Edit, Trash} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {DefaultResource} from "@/language-data/core/Default";

type FileRelationEntityTable =
  TanstackTableCreationProps<UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto>;

function fileRelationEntityTableActions(router: AppRouterInstance, languageData: DefaultResource, locale: string) {
  const actions: TanstackTableTableActionsType[] = [];
  actions.push({
    type: "simple",
    actionLocation: "table",
    cta: languageData.New,
    icon: Edit,
    onClick: () => {
      router.push(`/${locale}/management/file/file-relation-entities/new`);
    },
  });

  return actions;
}

function fileRelationEntityRowActions(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  locale: string,
): TanstackTableRowActionsType<UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto>[] {
  const actions: TanstackTableRowActionsType<UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto>[] = [
    {
      type: "simple",
      actionLocation: "row",
      cta: languageData.Edit,
      icon: Edit,
      onClick: (row) => {
        router.push(`/${locale}/management/file/file-relation-entities/${row.id}`);
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
      condition: () => isActionGranted(["FileService.FileRelation.Save"], grantedPolicies),
      onConfirm: (row) => {
        void deleteFileRelationEntitiesByIdApi(row.id).then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    },
  ];

  return actions;
}

function fileRelationEntityColumns(locale: string) {
  return tanstackTableCreateColumnsByRowData<UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto>({
    rows: $UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto.properties,
    config: {
      locale,
    },
  });
}

function fileRelationEntityTable(
  languageData: DefaultResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  locale: string,
): FileRelationEntityTable {
  const table: FileRelationEntityTable = {
    columnVisibility: {
      type: "hide",
      columns: ["id", "fileTypeId"],
    },
    tableActions: fileRelationEntityTableActions(router, languageData, locale),
    rowActions: fileRelationEntityRowActions(languageData, router, grantedPolicies, locale),
  };
  return table;
}
export const tableData = {
  fileRelationEntity: {
    columns: fileRelationEntityColumns,
    table: fileRelationEntityTable,
  },
};
