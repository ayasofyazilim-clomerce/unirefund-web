"use client";

import {$UniRefund_FileService_FileTypes_FileTypeUpdateDto} from "@ayasofyazilim/saas/FileService";
import type {
  UniRefund_FileService_FileTypes_FileTypeUpdateDto,
  UniRefund_FileService_Providers_ProviderListDto,
  UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto,
  UniRefund_FileService_FileTypes_FileTypeListDto,
} from "@ayasofyazilim/saas/FileService";
import {putFileTypesApi} from "@repo/actions/unirefund/FileService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePutResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";

export default function EditForm({
  languageData,
  fileTypeData,
  fileTypeGroupData,
  providerData,
}: {
  languageData: FileServiceResource;
  fileTypeData: UniRefund_FileService_FileTypes_FileTypeListDto;
  fileTypeGroupData: UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto[];
  providerData: UniRefund_FileService_Providers_ProviderListDto[];
}) {
  const router = useRouter();
  return (
    <SchemaForm<UniRefund_FileService_FileTypes_FileTypeUpdateDto>
      className="flex flex-col gap-4"
      formData={{
        ...fileTypeData,
        fileTypeGroupNamespace: fileTypeGroupData.find((item) => item.id === fileTypeData.fileTypeGroupID)?.namespace,
        isAIValidationRequired: false,
        isHumanValidationRequired: false,
      }}
      onSubmit={({formData}) => {
        if (!formData) return;
        void putFileTypesApi({
          id: fileTypeData.id,
          requestBody: formData,
        }).then((res) => {
          handlePutResponse(res, router);
        });
      }}
      schema={$UniRefund_FileService_FileTypes_FileTypeUpdateDto}
      submitText={languageData.Save}
      uiSchema={{
        fileTypeGroupNamespace: {
          "ui:widget": "File",
        },
        providerID: {
          "ui:widget": "Provider",
        },
      }}
      widgets={{
        File: CustomComboboxWidget<UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto>({
          languageData,
          list: fileTypeGroupData,
          selectIdentifier: "namespace",
          selectLabel: "name",
        }),
        Provider: CustomComboboxWidget<UniRefund_FileService_Providers_ProviderListDto>({
          languageData,
          list: providerData,
          selectIdentifier: "id",
          selectLabel: "type",
        }),
      }}
    />
  );
}
