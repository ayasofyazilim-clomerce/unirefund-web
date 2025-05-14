"use client";

import {$UniRefund_FileService_FileTypes_FileTypeCreateDto} from "@ayasofyazilim/saas/FileService";
import type {
  UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto,
  UniRefund_FileService_FileTypes_FileTypeCreateDto,
  UniRefund_FileService_Providers_ProviderListDto,
} from "@ayasofyazilim/saas/FileService";
import {postFileTypesApi} from "@repo/actions/unirefund/FileService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePutResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function NewForm({
  languageData,
  fileTypeGroupData,
  providerData,
}: {
  languageData: IdentityServiceResource;
  fileTypeGroupData: UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto[];

  providerData: UniRefund_FileService_Providers_ProviderListDto[];
}) {
  const router = useRouter();
  return (
    <SchemaForm<UniRefund_FileService_FileTypes_FileTypeCreateDto>
      className="flex flex-col gap-4"
      onSubmit={({formData}) => {
        if (!formData) return;
        void postFileTypesApi({
          requestBody: formData,
        }).then((res) => {
          handlePutResponse(res, router);
        });
      }}
      schema={$UniRefund_FileService_FileTypes_FileTypeCreateDto}
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
