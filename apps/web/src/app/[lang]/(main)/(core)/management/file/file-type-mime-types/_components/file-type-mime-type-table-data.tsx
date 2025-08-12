import type { FileServiceResource } from "@/language-data/unirefund/FileService";
import {
  $UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeCreateDto,
  $UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeListDto,
  $UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypesUpdateDto,
  type UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeCreateDto,
  type UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeListDto,
  type UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypesUpdateDto,
  type UniRefund_FileService_FileTypes_FileTypeListDto,
  type UniRefund_FileService_MimeTypes_MimeTypeListDto,
} from "@ayasofyazilim/saas/FileService";
import { deleteFileTypeMimeTypesByIdApi } from "@repo/actions/unirefund/FileService/delete-actions";
import { postFileTypeMimeTypesApi } from "@repo/actions/unirefund/FileService/post-actions";
import { putFileTypeMimeTypesApi } from "@repo/actions/unirefund/FileService/put-actions";
import type {
  TanstackTableRowActionsType,
  TanstackTableTableActionsType
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { FormReadyComponent } from "@repo/ui/form-ready";
import { handleDeleteResponse, handlePostResponse, handlePutResponse } from "@repo/utils/api";
import { isActionGranted, type Policy } from "@repo/utils/policies";
import { Edit, Plus, Trash } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { checkIsFormReady } from "../../_components/utils";


function fileTypeMimeTypesTableActions(
  lang: string,
  router: AppRouterInstance,
  languageData: FileServiceResource,
  mimeTypeData: UniRefund_FileService_MimeTypes_MimeTypeListDto[],
  fileTypeData: UniRefund_FileService_FileTypes_FileTypeListDto[],
) {
  const actions: TanstackTableTableActionsType[] = [];
  const isFormReady = checkIsFormReady({
    lang,
    languageData,
    mimeTypeDataLength: mimeTypeData.length,
    fileTypeDataLength: fileTypeData.length,
  });
  actions.push({
    type: "custom-dialog",
    actionLocation: "table",
    cta: "Yeni",
    title: "Yeni Ekle",
    icon: Plus,
    content: (
      <FormReadyComponent active={isFormReady.isActive} content={isFormReady.content}>
        <SchemaForm<UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeCreateDto>
          className="flex flex-col gap-4"
          onSubmit={({formData}) => {
            if (!formData) return;
            void postFileTypeMimeTypesApi({
              requestBody: formData,
            }).then((res) => {
              handlePostResponse(res, router);
            });
          }}
          schema={$UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeCreateDto}
          submitText="Kaydet"
          uiSchema={{
            mimeTypeId: {
              "ui:widget": "MimeType",
            },
            fileTypeNamespace: {
              "ui:widget": "File",
            },
          }}
          widgets={{
            MimeType: CustomComboboxWidget<UniRefund_FileService_MimeTypes_MimeTypeListDto>({
              languageData,
              list: mimeTypeData,
              selectIdentifier: "id",
              selectLabel: "mimeTypeCode",
            }),
            File: CustomComboboxWidget<UniRefund_FileService_FileTypes_FileTypeListDto>({
              languageData,
              list: fileTypeData,
              selectIdentifier: "namespace",
              selectLabel: "name",
            }),
          }}
        />
      </FormReadyComponent>
    ),
  });

  return actions;
}

function fileTypeMimeTypesRowActions(
  languageData: FileServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  mimeTypeData: UniRefund_FileService_MimeTypes_MimeTypeListDto[],
  fileTypeData: UniRefund_FileService_FileTypes_FileTypeListDto[],
): TanstackTableRowActionsType<UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeListDto>[] {
  const actions: TanstackTableRowActionsType<UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeListDto>[] = [
    {
      type: "custom-dialog",
      cta: languageData.Edit,
      title: languageData.Edit,
      actionLocation: "row",
      content: (row) => (
        <SchemaForm<UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypesUpdateDto>
          className="flex flex-col gap-4"
          formData={row}
          onSubmit={({formData}) => {
            if (!formData) return;
            void putFileTypeMimeTypesApi({
              id: row.id,
              requestBody: formData,
            }).then((res) => {
              handlePutResponse(res, router);
            });
          }}
          schema={$UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypesUpdateDto}
          submitText={languageData.Save}
          uiSchema={{
            mimeTypeId: {
              "ui:widget": "MimeType",
            },
            fileTypeNamespace: {
              "ui:widget": "File",
            },
          }}
          widgets={{
            MimeType: CustomComboboxWidget<UniRefund_FileService_MimeTypes_MimeTypeListDto>({
              languageData,
              list: mimeTypeData,
              selectIdentifier: "id",
              selectLabel: "mimeTypeCode",
            }),
            File: CustomComboboxWidget<UniRefund_FileService_FileTypes_FileTypeListDto>({
              languageData,
              list: fileTypeData,
              selectIdentifier: "namespace",
              selectLabel: "name",
            }),
          }}
        />
      ),
      icon: Edit,
      condition: () => isActionGranted(["FileService.FileTypeMimeType.Update"], grantedPolicies),
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
      condition: () => isActionGranted(["FileService.FileTypeMimeType.Delete"], grantedPolicies),
      onConfirm: (row) => {
        void deleteFileTypeMimeTypesByIdApi(row.id).then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    },
  ];

  return actions;
}

function fileTypeMimeTypesColumns(locale: string) {
  return tanstackTableCreateColumnsByRowData<UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeListDto>({
    rows: $UniRefund_FileService_FileTypeMimeTypes_FileTypeMimeTypeListDto.properties,
    config: {
      locale,
    },
  });
}

function fileTypeMimeTypesTable(
  lang: string,
  languageData: FileServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  mimeTypeData: UniRefund_FileService_MimeTypes_MimeTypeListDto[],
  fileTypeData: UniRefund_FileService_FileTypes_FileTypeListDto[],
) {
  const table = {
    fillerColumn: "fileTypeName",
    columnVisibility: {
      type: "hide",
      columns: ["id", "fileTypeId", "mimeTypeId"],
    },
    tableActions: fileTypeMimeTypesTableActions(lang, router, languageData, mimeTypeData, fileTypeData),
    rowActions: fileTypeMimeTypesRowActions(languageData, router, grantedPolicies, mimeTypeData, fileTypeData),
  };
  return table;
}
export const tableData = {
  fileTypeMimeTypes: {
    columns: fileTypeMimeTypesColumns,
    table: fileTypeMimeTypesTable,
  },
};
